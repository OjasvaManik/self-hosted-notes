import React from 'react'
import { Note } from "@/types/types";
import { getNoteAction } from "@/actions/actions";
import { notFound } from "next/navigation";
import TitleBar from "@/components/notes/title-bar";
import Banner from "@/components/notes/banner";
import NoteTagsList from "@/components/notes/note-tags-list";
import AddTagsToNote from "@/components/notes/add-tags-to-note";
import NoteEmojiPicker from "@/components/notes/note-emoji-picker";

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
      <Banner fileLocation={ note?.fileLocation } noteId={ id }/>
      <div className={ 'flex justify-start items-center px-3 py-2 space-x-2 w-fit' }>
        <NoteEmojiPicker noteId={ id } currentEmoji={ note.emoji }/>
        <TitleBar title={ note.title } noteId={ id }/>
        <div className={ 'hidden lg:flex flex-col justify-center' }>
          <AddTagsToNote id={ note?.id } currentTags={ note?.tags }/>
          <NoteTagsList tags={ note?.tags } noteId={ note.id }/>
        </div>
      </div>
      <div className={ 'lg:hidden' }>
        <AddTagsToNote id={ note?.id } currentTags={ note?.tags }/>
        <NoteTagsList tags={ note?.tags } noteId={ note.id }/>
      </div>
    </div>
  );
};

export default NotePage;
