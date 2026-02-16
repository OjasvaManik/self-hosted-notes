import React from 'react'
import { Note } from "@/types/types";
import { getNoteAction } from "@/actions/actions";
import { notFound } from "next/navigation";
import TitleBar from "@/components/notes/title-bar";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const NotePage = async ( { params }: Props ) => {
  const { id } = await params;

  const note: Note | null = await getNoteAction( id );

  if ( !note ) {
    notFound();
  }

  return (
    <div>

      {/*<div className={ 'h-72 bg-secondary shadow-md' }>*/ }

      {/*</div>*/ }
      <div className={ 'flex justify-start items-center px-3 py-2 space-x-2 w-fit' }>
        <div className="h-14 w-16 lg:w-14 bg-primary rounded-full shadow-md">

        </div>
        <TitleBar title={ note.title }/>
      </div>
    </div>
  );
};

export default NotePage;
