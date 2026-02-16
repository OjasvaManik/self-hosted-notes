"use client"

import { useTransition } from "react"
import { Input } from "@/components/ui/input"
import { updateTitleAction } from "@/actions/actions" // Ensure path is correct
import { toast } from "sonner"

type Props = {
  title: string
  noteId: string
}

const TitleBar = ( { title, noteId }: Props ) => {
  const [ isPending, startTransition ] = useTransition()

  const handleUpdate = ( e: React.FocusEvent<HTMLInputElement> ) => {
    const newTitle = e.target.value
    if ( newTitle === title ) return

    startTransition( async () => {
      try {
        if ( newTitle.trim() === "" ) {
          toast.error( "Title cannot be empty" )
          return
        }
        await updateTitleAction( noteId, newTitle )
        toast.success( "Title updated" )
      } catch ( error ) {
        console.error( error )
        toast.error( "Failed to update title" )
      }
    } )
  }

  const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
    if ( e.key === "Enter" ) {
      e.currentTarget.blur()
    }
  }

  return (
    <Input
      defaultValue={ title }
      type="text"
      disabled={ isPending }
      onBlur={ handleUpdate }
      onKeyDown={ handleKeyDown }
      className="h-14 max-w-2xl border-0 bg-card text-5xl font-bold shadow-md focus-visible:border-none focus-visible:ring-0 md:text-5xl"
    />
  )
}

export default TitleBar