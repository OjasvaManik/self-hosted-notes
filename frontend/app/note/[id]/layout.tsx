import NavBar from "@/components/nav-bar";
import { getNoteEmojiAction, getNoteTitleAction } from "@/actions/actions";
import React from "react";

export default async function NoteLayout( {
                                            children,
                                            params,
                                          }: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Update type to Promise
} ) {
  // Unwrapping the params promise
  const { id } = await params;

  const title = await getNoteTitleAction( id );
  const emoji = await getNoteEmojiAction( id );

  return (
    <>
      <NavBar title={ title } emoji={ emoji }/>
      { children }
    </>
  );
}