"use server"

import { redirect } from "next/navigation"
import { CreateNoteResponse, GetAllNotesResponse, GetAllTagsResponse, Note } from "@/types/types";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function createNoteAction() {
  const res = await fetch( `${ API_URL }/notes/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  } )

  if ( !res.ok ) throw new Error( "Failed to create note" )

  const data: CreateNoteResponse = await res.json()
  redirect( `/note/${ data.id }` )
}

export const getNoteAction = async ( id: string ): Promise<Note | null> => {
  try {
    const res = await fetch( `${ API_URL }/notes/${ id }`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } );
    if ( res.status === 404 ) return null;
    if ( !res.ok ) {
      console.error( `Failed to fetch note: ${ res.status }` );
      return null;
    }
    return await res.json();
  } catch ( error ) {
    console.error( "Server Action Error (getNote):", error );
    return null;
  }
};


export async function changePinStatusAction( noteId: string ) {
  const res = await fetch( `${ API_URL }/notes/pin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId } ),
  } );

  if ( !res.ok ) {
    throw new Error( "Failed to change pin status" );
  }

  // Refreshes the notes list on the client to show the new status
  revalidatePath( "/" );
  return await res.json();
}

export async function changeLockStatusAction( noteId: string ) {
  const res = await fetch( `${ API_URL }/notes/lock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId } ),
  } );

  if ( !res.ok ) {
    throw new Error( "Failed to change lock status" );
  }

  revalidatePath( "/" );
  return await res.json();
}

export async function changeTrashStatusAction( noteId: string ) {
  const res = await fetch( `${ API_URL }/notes/trash`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId } ),
  } );

  if ( !res.ok ) {
    throw new Error( "Failed to change trash status" );
  }

  revalidatePath( "/" );
  return await res.json();
}

export async function getAllNotesAction( params: Record<string, string> ): Promise<GetAllNotesResponse> {
  // Filter out undefined/null values before creating URLSearchParams
  const cleanParams = Object.entries( params ).reduce( ( acc, [ key, value ] ) => {
    if ( value !== undefined && value !== null && value !== '' ) {
      acc[ key ] = value;
    }
    return acc;
  }, {} as Record<string, string> );

  const queryString = new URLSearchParams( cleanParams ).toString();

  try {
    const response = await fetch( `${ API_URL }/notes/all?${ queryString }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    } );

    if ( !response.ok ) {
      console.error( `Error fetching notes: ${ response.status }` );
      return { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true };
    }

    return await response.json();
  } catch ( error ) {
    console.error( "Server Action Error:", error );
    throw error;
  }
}

export const getAllNotesForSearchAction = async () => {
  try {
    const res = await fetch( `${ API_URL }/notes/search`, { cache: "no-store" } )
    if ( !res.ok ) return []
    return await res.json()
  } catch ( e ) {
    console.error( "Failed to fetch notes for search", e )
    return []
  }
}

export async function getTrashedNotesAction(): Promise<Note[]> {
  try {
    const res = await fetch( `${ API_URL }/notes/trashed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store", // Critical: prevents caching so you see immediate updates
    } );

    if ( !res.ok ) {
      console.error( `Failed to fetch trashed notes: ${ res.status }` );
      return [];
    }

    return await res.json();

  } catch ( error ) {
    console.error( "Server Action Error (getTrashedNotes):", error );
    return [];
  }
}

export async function getLockedNotesAction(): Promise<Note[]> {
  try {
    const res = await fetch( `${ API_URL }/notes/locked`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store",
    } );

    if ( !res.ok ) {
      console.error( `Failed to fetch locked notes: ${ res.status }` );
      return [];
    }

    return await res.json();

  } catch ( error ) {
    console.error( "Server Action Error (getLockedNotes):", error );
    return [];
  }
}

export const getNoteTitleAction = async ( id: String ) => {
  const res = await fetch( `${ API_URL }/notes/title/${ id }`, { cache: "no-store" } )
  if ( !res.ok ) return ""
  return await res.text()
}

export const getNoteEmojiAction = async ( id: String ) => {
  const res = await fetch( `${ API_URL }/notes/emoji/${ id }`, { cache: "no-store" } )
  if ( !res.ok ) return ""
  return await res.text()
}

export const deleteNoteAction = async ( noteId: string ) => {
  const res = await fetch( `${ API_URL }/notes/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId } ),
  } );
  if ( !res.ok ) {
    throw new Error( "Failed to delete note" );
  }
  revalidatePath( "/" );
  return await res.json();
}

export async function getTagsAction(): Promise<string[]> {
  try {
    const res = await fetch( `${ API_URL }/tags/all`, { cache: "no-store" } )
    if ( !res.ok ) return []
    const data: GetAllTagsResponse = await res.json()
    return data.tags
  } catch ( e ) {
    console.error( "Failed to fetch tags", e )
    return []
  }
}

export const addTagResponseAction = async ( tagName: string ) => {
  const res = await fetch( `${ API_URL }/tags/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { tagName } ),
  } );

  if ( !res.ok ) {
    throw new Error( "Failed to add tag" );
  }

  revalidatePath( "/" );
  return await res.json();
}

export const deleteTagAction = async ( tagName: string ) => {
  const res = await fetch( `${ API_URL }/tags/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { tagName } ),
  } );

  if ( !res.ok ) {
    throw new Error( "Failed to change trash status" );
  }

  revalidatePath( "/" );
  return await res.json();
}

export const accessLockedNotesWithPasswordAction = async ( password: string ) => {
  const res = await fetch( `${ API_URL }/notes/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { password } ),
  } );

  console.log( "STATUS:", res.status );

  const text = await res.text();
  console.log( "BODY:", text );

  if ( res.status === 401 ) return false;
  if ( !res.ok ) throw new Error( "Server error" );

  return text === "true";
};

export async function deleteFileAction( noteId: string ) {
  const res = await fetch( `${ API_URL }/files/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( noteId ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to delete file" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}

export const updateTitleAction = async ( noteId: string, title: string ) => {
  const res = await fetch( `${ API_URL }/notes/title`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId, title } ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to update title" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}

export const updateImgUrlAction = async ( noteId: string, imgUrl: string ) => {
  const res = await fetch( `${ API_URL }/notes/img-url`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId, imgUrl } ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to update Image" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}

export const updateEmojiAction = async ( noteId: string, emoji: string ) => {
  const res = await fetch( `${ API_URL }/notes/emoji`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId, emoji } ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to update emoji" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}

export const updateContentAction = async ( noteId: string, content: string ) => {
  const res = await fetch( `${ API_URL }/notes/content`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId, content } ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to update content" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}

export const updateTagsAction = async ( noteId: string, tags: string[] ) => {
  const res = await fetch( `${ API_URL }/notes/tags`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( { id: noteId, tags } ),
  } )

  if ( !res.ok ) {
    throw new Error( "Failed to update tags" )
  }

  revalidatePath( `/note/${ noteId }` )
  return await res.json()
}