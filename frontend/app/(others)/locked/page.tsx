import React from 'react'
import Image from "next/image"
import { getLockedNotesAction } from "@/actions/actions"
import { UnlockButton } from "@/components/unlock-button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Lock } from "lucide-react"
import CreateNoteButton from "@/components/create-note-button"
import LockedAccessGuard from "@/components/locked-access-guard"
import Link from "next/link"
import { cn } from "@/lib/utils";

const LockedPage = async () => {
  const notes = await getLockedNotesAction()
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_API_URL || ""

  return (
    <LockedAccessGuard>
      <div className='h-full overflow-y-auto no-scrollbar px-3 py-2'>
        <h1 className='font-bold uppercase border-b-2 pb-1 mb-1'>Locked Notes</h1>

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
                className={ cn( 'group relative w-full bg-card shadow-md p-2 overflow-hidden cursor-pointer transition-all group rounded-md', note.fileLocation ?? 'hover:bg-secondary/50' ) }
              >
                { note.fileLocation && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3/5 opacity-50 group-hover:opacity-100 pointer-events-none">
                    <Image
                      src={ `${ baseUrl }${ note.fileLocation }` }
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-card via-card/60 to-transparent"/>
                  </div>
                ) }

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[5rem]">
                  <div className="flex justify-between items-start w-full mb-4">
                    <p className="font-semibold text-base truncate pr-2 max-w-[80%]">
                      { note.title }
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-xs text-muted-foreground mt-auto">
                    <div className="flex gap-1 flex-wrap max-w-[65%]">
                      { note.tags?.map( ( t ) => (
                        <span
                          key={ t }
                          className="bg-muted/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] border border-border/50"
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
