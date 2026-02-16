import NavBar from "@/components/nav-bar";
import { getNoteTitleAction } from "@/actions/actions";
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

  return (
    <>
      <NavBar title={ title }/>
      { children }
    </>
  );
}