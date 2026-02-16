"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from "next/image"
import { Note } from "@/types/types"
import { getAllNotesAction } from "@/actions/actions"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils";
import NoteButtons from "@/components/notes/note-buttons";

const PAGE_SIZE = 15

const NotesList = () => {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_API_URL || ""

  const [ notes, setNotes ] = useState<Note[]>( [] )
  const [ page, setPage ] = useState( 0 )
  const [ hasMore, setHasMore ] = useState( true )
  const [ loading, setLoading ] = useState( false )

  const observerTarget = useRef<HTMLDivElement>( null )

  const fetchNotes = useCallback( async ( pageToFetch: number, isReset: boolean ) => {
    if ( loading ) return
    setLoading( true )
    try {
      const actionParams: Record<string, string> = {}
      actionParams[ 'page' ] = pageToFetch.toString()
      actionParams[ 'size' ] = PAGE_SIZE.toString()
      actionParams[ 'sortBy' ] = searchParams.get( 'sortBy' ) || 'updatedAt'
      actionParams[ 'direction' ] = ( searchParams.get( 'sortDir' ) || 'DESC' ).toUpperCase()

      const filterVal = searchParams.get( 'filter' )
      if ( filterVal ) {
        if ( [ 'pinned', 'trashed' ].includes( filterVal ) ) {
          actionParams[ 'filterType' ] = filterVal
        } else if ( filterVal !== 'all' ) {
          if ( [ 'title', 'createdAt', 'updatedAt' ].includes( filterVal ) ) {
            actionParams[ 'sortBy' ] = filterVal
          } else {
            actionParams[ 'filterTag' ] = filterVal
          }
        }
      }

      const data = await getAllNotesAction( actionParams )
      setNotes( prev => isReset ? data.content : [ ...prev, ...data.content ] )
      setHasMore( !data.last )
      setPage( pageToFetch )

    } catch ( e ) {
      console.error( "Failed to load notes", e )
    } finally {
      setLoading( false )
    }
  }, [ searchParams ] )

  useEffect( () => {
    setNotes( [] )
    setPage( 0 )
    setHasMore( true )
    fetchNotes( 0, true )
  }, [ searchParams, fetchNotes ] )

  useEffect( () => {
    const observer = new IntersectionObserver(
      ( entries ) => {
        if ( entries[ 0 ].isIntersecting && hasMore && !loading ) {
          fetchNotes( page + 1, false )
        }
      },
      { threshold: 1.0 }
    )
    if ( observerTarget.current ) observer.observe( observerTarget.current )
    return () => {
      if ( observerTarget.current ) observer.unobserve( observerTarget.current )
    }
  }, [ observerTarget, hasMore, loading, page, fetchNotes ] )

  const displayedNotes = notes
    .filter( note => !note.isTrashed && !note.isLocked )
    .sort( ( a, b ) => ( a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1 ) )

  return (
    <div className='h-full overflow-y-auto no-scrollbar space-y-2 p-1 pb-60'>
      { displayedNotes.map( note => (
        <div key={ note.id }
             onClick={ () => router.push( `/note/${ note.id }` ) }
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

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start w-full">
              <div className={ 'flex justify-start items-center space-x-1' }>
                <p className={ 'text-[16px]' }>{ note.emoji }</p>
                <p className='font-semibold text-base truncate pr-2 max-w-64'>{ note.title }</p>
              </div>
              { note.isPinned && <span
                  className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shadow-sm">Pinned</span> }
            </div>

            <div className="flex justify-between items-end text-xs text-muted-foreground mt-2">
              <div className="flex gap-1 flex-wrap max-w-[65%]">
                { note.tags?.map( t => (
                  <span key={ t }
                        className="bg-muted/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] border border-border/50">#{ t }</span>
                ) ) }
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px]">
                  { note.updatedAt ? new Date( note.updatedAt ).toLocaleDateString() : '—' }
                </span>

                <NoteButtons note={ note } setNotes={ setNotes }/>
              </div>
            </div>
          </div>
        </div>
      ) ) }

      <div ref={ observerTarget } className="h-4 w-full flex justify-center items-center py-4">
        { loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground"/> }
        { !loading && displayedNotes.length === 0 &&
            <span className="text-xs text-muted-foreground">No notes found.</span> }
        { !loading && !hasMore && displayedNotes.length > 0 &&
            <span className="text-[10px] text-muted-foreground">End of list</span> }
      </div>
    </div>
  )
}
export default NotesList