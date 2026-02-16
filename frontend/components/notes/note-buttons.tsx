'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Lock, LockOpen, Pin, PinOff, TrashIcon } from "lucide-react"
import { changeLockStatusAction, changePinStatusAction, changeTrashStatusAction } from "@/actions/actions"
import { toast } from "sonner"
import { Note } from "@/types/types"

type Props = {
  note: Note
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

const NoteButtons = ( { note, setNotes }: Props ) => {
  const router = useRouter()
  const params = useParams()

  const handlePin = async ( e: React.MouseEvent ) => {
    e.stopPropagation()

    setNotes( prev =>
      prev.map( n =>
        n.id === note.id ? { ...n, isPinned: !n.isPinned } : n
      )
    )

    try {
      await changePinStatusAction( note.id )
      toast.success( "Pin status changed" )
    } catch ( error ) {
      setNotes( prev =>
        prev.map( n =>
          n.id === note.id ? { ...n, isPinned: !n.isPinned } : n
        )
      )
    }
  }

  const handleLock = async ( e: React.MouseEvent ) => {
    e.stopPropagation()

    setNotes( prev =>
      prev.map( n =>
        n.id === note.id ? { ...n, isLocked: !n.isLocked } : n
      )
    )

    if ( params.id === note.id ) {
      router.push( "/" )
    }

    try {
      await changeLockStatusAction( note.id )
      toast.success( "Note Locked" )
    } catch ( error ) {
      setNotes( prev =>
        prev.map( n =>
          n.id === note.id ? { ...n, isLocked: !n.isLocked } : n
        )
      )
    }
  }

  const handleTrash = async ( e: React.MouseEvent ) => {
    e.stopPropagation()

    setNotes( prev =>
      prev.filter( n => n.id !== note.id )
    )

    if ( params.id === note.id ) {
      router.push( "/" )
    }

    try {
      await changeTrashStatusAction( note.id )
      toast.success( "Note Trashed" )
    } catch ( error ) {
      toast.error( "Failed to trash note" )
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 hover:bg-background/80"
        onClick={ handleLock }
      >
        { note.isLocked
          ? <Lock className="w-3 h-3 text-red-500"/>
          : <LockOpen className="w-3 h-3"/> }
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 hover:bg-background/80"
        onClick={ handlePin }
      >
        { note.isPinned
          ? <PinOff className="w-3 h-3 text-primary"/>
          : <Pin className="w-3 h-3"/> }
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 hover:text-destructive hover:bg-background/80"
        onClick={ handleTrash }
      >
        <TrashIcon className="w-3 h-3"/>
      </Button>
    </div>
  )
}

export default NoteButtons
