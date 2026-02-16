// app/locked/page.tsx
import React from 'react'
import { getLockedNotesAction } from "@/actions/actions"
import { UnlockButton } from "@/components/unlock-button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Lock } from "lucide-react"
import CreateNoteButton from "@/components/create-note-button"
import LockedAccessGuard from "@/components/locked-access-guard"
import Link from "next/link";

const LockedPage = async () => {
  const notes = await getLockedNotesAction()

  return (
    <LockedAccessGuard>
      <div className='h-full overflow-y-auto no-scrollbar px-3 py-2'>
        <h1 className={ 'font-bold uppercase border-b-2 pb-1 mb-1' }>Locked Notes</h1>
        { notes.length === 0 ? (
          <div className='w-full min-h-[90vh] flex items-center justify-center'>
            <Empty className='w-full h-full'>
              <EmptyHeader>
                <EmptyMedia variant="default" className='text-primary h-12 w-12'>
                  <Lock className='h-12 w-12'/>
                </EmptyMedia>
                <EmptyTitle>No notes locked</EmptyTitle>
                <EmptyDescription>
                  <p>No note is locked.</p>
                  <p>Go to sidebar or open a note to lock.</p>
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className='flex items-center justify-center gap-x-2 w-fit'>
                <CreateNoteButton/>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 lg:grid lg:grid-cols-4 lg:gap-2 lg:space-y-0">
            { notes.map( ( note ) => (
              <Link
                href={ `/note/${ note.id }` }
                key={ note.id }
                className='w-full bg-card shadow-md p-3 flex flex-col justify-between hover:bg-secondary/50 transition-all border border-transparent'
              >
                <div className="flex justify-between items-start w-full mb-4">
                  <p className='font-semibold text-base truncate pr-2'>
                    { note.title }
                  </p>
                </div>

                <div className="flex justify-between items-end text-xs text-muted-foreground mt-auto">
                  <div className="flex gap-1 flex-wrap">
                    { note.tags?.map( ( t ) => (
                      <span
                        key={ t }
                        className="bg-muted px-1.5 py-0.5 rounded text-[10px]"
                      >
                        #{ t }
                      </span>
                    ) ) }
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px]">
                      { note.updatedAt
                        ? new Date( note.updatedAt ).toLocaleDateString()
                        : '—' }
                    </span>

                    <UnlockButton noteId={ note.id }/>
                  </div>
                </div>
              </Link>
            ) ) }
          </div>
        ) }
      </div>
    </LockedAccessGuard>
  )
}

export default LockedPage
