'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Lock, LockOpen, Pin, PinOff, TrashIcon } from "lucide-react"
import { changeLockStatusAction, changePinStatusAction, changeTrashStatusAction } from "@/actions/actions"
import { toast } from "sonner"

type Props = {
  noteId: string
  isLocked: boolean
  isPinned: boolean
}

const NotePageButtons = ( { noteId, isLocked, isPinned }: Props ) => {
  const router = useRouter()

  const handlePin = async ( e: React.MouseEvent ) => {
    e.stopPropagation()
    await changePinStatusAction( noteId )
    toast.success( "Pin status changed" )
    router.refresh()
  }

  const handleLock = async ( e: React.MouseEvent ) => {
    e.stopPropagation()
    await changeLockStatusAction( noteId )
    toast.success( "Lock status changed" )
    router.refresh()
  }

  const handleTrash = async ( e: React.MouseEvent ) => {
    e.stopPropagation()
    await changeTrashStatusAction( noteId )
    toast.success( "Note trashed" )
    router.push( "/" )
  }

  return (
    <div className="flex gap-2">
      <Button size="icon" variant="ghost" onClick={ handleLock }>
        { isLocked
          ? <Lock className="w-4 h-4 text-red-500"/>
          : <LockOpen className="w-4 h-4"/> }
      </Button>

      <Button size="icon" variant="ghost" onClick={ handlePin }>
        { isPinned
          ? <PinOff className="w-4 h-4 text-primary"/>
          : <Pin className="w-4 h-4"/> }
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="hover:text-destructive"
        onClick={ handleTrash }
      >
        <TrashIcon className="w-4 h-4"/>
      </Button>
    </div>
  )
}

export default NotePageButtons
