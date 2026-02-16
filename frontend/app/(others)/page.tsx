import React from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { Notebook } from "lucide-react";
import CreateNoteButton from "@/components/create-note-button";

const HomePage = () => {
  return (
    <div className={ 'w-full min-h-[90vh] flex items-center justify-center' }>
      <Empty className={ 'w-full h-full' }>
        <EmptyHeader>
          <EmptyMedia variant="default" className={ 'text-primary h-12 w-12' }>
            <Notebook className={ 'h-12 w-12' }/>
          </EmptyMedia>
          <EmptyTitle>No notes</EmptyTitle>
          <EmptyDescription>
            <p>No note is opened.</p>
            <p>Create or open a note.</p>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className={ 'flex items-center justify-center gap-x-2 w-fit' }>
          <CreateNoteButton/>
        </EmptyContent>
      </Empty>
    </div>
  )
}
export default HomePage
