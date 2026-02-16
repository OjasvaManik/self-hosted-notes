"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Note } from "@/types/types";
import {
  changeLockStatusAction,
  changePinStatusAction,
  changeTrashStatusAction,
  getAllNotesAction
} from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, LockOpen, Pin, PinOff, TrashIcon } from "lucide-react";

import { toast } from "sonner"

const PAGE_SIZE = 15;

const NotesList = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const [ notes, setNotes ] = useState<Note[]>( [] );
  const [ page, setPage ] = useState( 0 );
  const [ hasMore, setHasMore ] = useState( true );
  const [ loading, setLoading ] = useState( false );

  const observerTarget = useRef<HTMLDivElement>( null );

  // ... (fetchNotes logic remains the same) ...
  const fetchNotes = useCallback( async ( pageToFetch: number, isReset: boolean ) => {
    if ( loading ) return;
    setLoading( true );
    try {
      const actionParams: Record<string, string> = {};
      actionParams[ 'page' ] = pageToFetch.toString();
      actionParams[ 'size' ] = PAGE_SIZE.toString();
      actionParams[ 'sortBy' ] = 'updatedAt';
      actionParams[ 'direction' ] = ( searchParams.get( 'sortDir' ) || 'DESC' ).toUpperCase();

      const filterVal = searchParams.get( 'filter' );
      if ( filterVal ) {
        if ( [ 'pinned', 'trashed' ].includes( filterVal ) ) {
          actionParams[ 'filterType' ] = filterVal;
        } else if ( filterVal !== 'all' ) {
          if ( [ 'title', 'createdAt', 'updatedAt' ].includes( filterVal ) ) {
            actionParams[ 'sortBy' ] = filterVal;
          } else {
            actionParams[ 'filterTag' ] = filterVal;
          }
        }
      }

      const data = await getAllNotesAction( actionParams );
      setNotes( prev => isReset ? data.content : [ ...prev, ...data.content ] );
      setHasMore( !data.last );
      setPage( pageToFetch );

    } catch ( e ) {
      console.error( "Failed to load notes", e );
    } finally {
      setLoading( false );
    }
  }, [ searchParams ] );

  useEffect( () => {
    setNotes( [] );
    setPage( 0 );
    setHasMore( true );
    fetchNotes( 0, true );
  }, [ searchParams, fetchNotes ] );

  useEffect( () => {
    const observer = new IntersectionObserver(
      ( entries ) => {
        if ( entries[ 0 ].isIntersecting && hasMore && !loading ) {
          fetchNotes( page + 1, false );
        }
      },
      { threshold: 1.0 }
    );
    if ( observerTarget.current ) observer.observe( observerTarget.current );
    return () => {
      if ( observerTarget.current ) observer.unobserve( observerTarget.current );
    };
  }, [ observerTarget, hasMore, loading, page, fetchNotes ] );


  // --- HANDLERS ---

  const handlePin = async ( e: React.MouseEvent, noteId: string ) => {
    e.stopPropagation(); // Prevent opening the note

    // 1. Optimistic Update
    setNotes( prev => prev.map( n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n ) );

    // 2. Server Action
    try {
      await changePinStatusAction( noteId );
      toast.success( "Pin status changed" );
    } catch ( error ) {
      console.error( "Failed to pin note", error );
      // Revert on failure
      setNotes( prev => prev.map( n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n ) );
    }
  };

  const handleLock = async ( e: React.MouseEvent, noteId: string ) => {
    e.stopPropagation();

    // Toggle lock state locally
    setNotes( prev => prev.map( n => n.id === noteId ? { ...n, isLocked: !n.isLocked } : n ) );
    if ( params.id === noteId ) {
      router.push( "/" );
    }

    try {
      await changeLockStatusAction( noteId );
      toast.success( "Note Locked" );
    } catch ( error ) {
      console.error( "Failed to lock note", error );
      setNotes( prev => prev.map( n => n.id === noteId ? { ...n, isLocked: !n.isLocked } : n ) );
    }
  };

  const handleTrash = async ( e: React.MouseEvent, noteId: string ) => {
    e.stopPropagation();

    // Ideally, remove it from the list immediately
    setNotes( prev => prev.filter( n => n.id !== noteId ) );
    if ( params.id === noteId ) {
      router.push( "/" );
    }

    try {
      await changeTrashStatusAction( noteId );
      toast.success( "Note Trashed" );
    } catch ( error ) {
      console.error( "Failed to trash note", error );
      // Re-fetch or add back on failure (complex to revert exact position, usually just re-fetch)
      fetchNotes( page, true );
    }
  };


  const displayedNotes = notes
    .filter( note => !note.isTrashed && !note.isLocked )
    .sort( ( a, b ) => ( a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1 ) );

  return (
    <div className='h-full overflow-y-auto no-scrollbar space-y-2 p-1 pb-60'>
      { displayedNotes.map( note => (
        <div key={ note.id }
             onClick={ () => router.push( `/note/${ note.id }` ) }
             className='w-full bg-card shadow-md p-2 flex flex-col justify-between cursor-pointer hover:bg-secondary/50 transition-all'>

          <div className="flex justify-between items-start w-full">
            <p className='font-semibold text-base truncate pr-2'>{ note.title }</p>
            { note.isPinned && <span
                className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Pinned</span> }
          </div>

          <div className="flex justify-between items-end text-xs text-muted-foreground">
            <div className="flex gap-1 flex-wrap">
              { note.tags?.map( t => (
                <span key={ t } className="bg-muted px-1.5 py-0.5 rounded text-[10px]">#{ t }</span>
              ) ) }
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px]">
                  { note.updatedAt ? new Date( note.updatedAt ).toLocaleDateString() : '—' }
              </span>

              <div className="flex gap-1">
                {/* LOCK BUTTON */ }
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={ ( e ) => handleLock( e, note.id ) }
                >
                  { note.isLocked ? <Lock className="w-3 h-3 text-red-500"/> : <LockOpen className="w-3 h-3"/> }
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={ ( e ) => handlePin( e, note.id ) }
                >
                  { note.isPinned ? <PinOff className="w-3 h-3 text-primary"/> : <Pin className="w-3 h-3"/> }
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:text-destructive"
                  onClick={ ( e ) => handleTrash( e, note.id ) }
                >
                  <TrashIcon className="w-3 h-3"/>
                </Button>
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