'use client'

import React, { useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { updateTagsAction } from "@/actions/actions"
import { toast } from "sonner"

type Props = {
  noteId: string
  tagName: string
  currentTags: string[]
}

const RemoveTagButton = ( { noteId, tagName, currentTags }: Props ) => {
  const [ isPending, startTransition ] = useTransition()

  const handleRemoveTag = () => {
    const updatedTags = currentTags.filter( tag => tag !== tagName )

    startTransition( async () => {
      try {
        await updateTagsAction( noteId, updatedTags )
        toast.success( `Tag #${ tagName } removed` )
      } catch ( error ) {
        toast.error( "Failed to remove tag" )
      }
    } )
  }

  return (
    <Button
      variant="ghost"
      onClick={ handleRemoveTag }
      disabled={ isPending }
      className="hover:bg-transparent"
    >
      <XIcon/>
    </Button>
  )
}

export default RemoveTagButton
