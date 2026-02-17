"use client"

import { useTransition } from "react"
import { deleteFileAction } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
  noteId: string
}

const RemoveFile = ( { noteId }: Props ) => {
  const [ isPending, startTransition ] = useTransition()

  const handleRemove = () => {
    startTransition( async () => {
      try {
        await deleteFileAction( noteId )
        toast.success( "File removed" )
      } catch ( error ) {
        toast.error( "Failed to remove file" )
      }
    } )
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={ handleRemove }
      disabled={ isPending }
    >
      { isPending ? (
        <Loader2 className="h-4 w-4 animate-spin"/>
      ) : (
        <Trash2 className="h-4 w-4"/>
      ) }
    </Button>
  )
}

export default RemoveFile