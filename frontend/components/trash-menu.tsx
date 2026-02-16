"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList, } from "@/components/ui/command"
import { TrashIcon, Undo2 } from "lucide-react";
import { changeTrashStatusAction, deleteNoteAction, getTrashedNotesAction } from "@/actions/actions";
import { Note } from "@/types/types";
import { CommandItem } from "cmdk";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export function TrashMenu() {
  const [ open, setOpen ] = React.useState( false )
  const [ notes, setNotes ] = React.useState<Note[]>( [] )

  const params = useParams();
  const router = useRouter();

  React.useEffect( () => {
    if ( open ) {
      const fetchData = async () => {
        const trash = await getTrashedNotesAction()
        setNotes( trash )
      }
      fetchData()
    }
  }, [ open ] )

  const handleTrash = async ( e: React.MouseEvent, noteId: string ) => {
    e.stopPropagation();
    setNotes( prev => prev.filter( n => n.id !== noteId ) );

    try {
      await changeTrashStatusAction( noteId );
      toast.success( "Note Removed from trashed" );
    } catch ( error ) {
      console.error( "Failed to trash note", error );
    }
  };

  const handleDelete = async ( e: React.MouseEvent, noteId: string ) => {
    e.stopPropagation();
    setNotes( prev => prev.filter( n => n.id !== noteId ) );
    if ( params.id === noteId ) {
      router.push( "/" );
    }
    try {
      await deleteNoteAction( noteId );
      toast.success( "Note Deleted" );
    } catch ( error ) {
      console.error( "Failed to delete note", error );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={ () => setOpen( true ) } variant="destructive">
        <TrashIcon/>
        <p>Trash</p>
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <Command>
          <CommandInput placeholder="Type a command or search..."/>
          <CommandList>
            <CommandGroup heading="Trash Items">
              <CommandEmpty>No results found.</CommandEmpty>
              { notes.map( ( note ) => (
                <CommandItem key={ note.id } value={ note.title }
                             className={ 'px-3 py-1 rounded-xl flex items-center justify-between gap-2 hover:bg-sidebar/50 transition-all' }>
                  <span className={ 'truncate' }>{ note.title }</span>
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={ ( e ) => handleTrash( e, note.id ) }
                    >
                      <Undo2 className="w-3 h-3"/>
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={ ( e ) => handleDelete( e, note.id ) }
                    >
                      <TrashIcon className="w-3 h-3"/>
                    </Button>
                  </div>
                </CommandItem>
              ) ) }
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
