'use client'

import React, { useState, useTransition } from "react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { updateEmojiAction } from "@/actions/actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";

type Props = {
  noteId: string
  currentEmoji?: string | null
}

const NoteEmojiPicker = ( { noteId, currentEmoji }: Props ) => {
  const [ emoji, setEmoji ] = useState<string>( currentEmoji || "" )
  const [ open, setOpen ] = useState( false )
  const [ isPending, startTransition ] = useTransition()

  const handleSelect = ( data: EmojiClickData ) => {
    const selected = data.emoji
    setEmoji( selected )
    setOpen( false )

    startTransition( async () => {
      try {
        await updateEmojiAction( noteId, selected )
        toast.success( "Emoji updated" )
      } catch ( error ) {
        toast.error( "Failed to update emoji" )
      }
    } )
  }

  return (
    <div className="relative">
      <Button
        onClick={ () => setOpen( prev => !prev ) }
        disabled={ isPending }
        className="h-14 w-14 flex items-center justify-center text-3xl bg-secondary rounded-full shadow-md hover:scale-105 transition"
      >
        { emoji || "🙂" }
      </Button>

      { open && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker onEmojiClick={ handleSelect }/>
        </div>
      ) }
    </div>
  )
}

export default NoteEmojiPicker
