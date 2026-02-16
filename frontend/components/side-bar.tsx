import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ArrowRightFromLine, Tag } from "lucide-react"
import NotesList from "@/components/notes-list"
import { getTagsAction } from "@/actions/actions"
import CreateNoteButton from "@/components/create-note-button"
import { NotesFilter } from "@/components/notes-filter"
import Link from "next/link";
import { TrashMenu } from "@/components/trash-menu";
import AccessLockDialog from "@/components/access-lock-dialog";
import SearchNotes from "@/components/search-notes";

const SideBar = async () => {
  const tags = await getTagsAction()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <ArrowRightFromLine/>
        </Button>
      </SheetTrigger>
      <SheetContent side={ 'left' } className="w-100 sm:w-135 flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Notes</SheetTitle>
          <SheetDescription>Select filters to organize your view.</SheetDescription>
        </SheetHeader>

        {/* Removed px-6 from this parent container */ }
        <div className='w-full space-y-2 flex flex-col h-full'>

          {/* Group: Elements that need px-6 */ }
          <div className="px-6 space-y-2">
            <div className='grid grid-cols-2 w-full gap-1'>
              <CreateNoteButton/>
              <TrashMenu/>
              <Link href={ '/tags' }>
                <Button variant={ 'secondary' } className={ 'w-full' }>
                  <Tag/>
                  <p>Tags</p>
                </Button>
              </Link>
              <AccessLockDialog/>
            </div>
            <SearchNotes/>
            <NotesFilter tags={ tags }/>
          </div>

          {/* Group: NotesList with px-5 */ }
          <div className="px-5 h-full">
            <NotesList/>
          </div>

        </div>

      </SheetContent>
    </Sheet>
  )
}
export default SideBar