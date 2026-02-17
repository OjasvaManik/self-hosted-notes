"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import ImageUrlPopover from "@/components/notes/image-url-popover";

type Props = {
  noteId: string
}

const UploadFile = ( { noteId }: Props ) => {
  const [ isPending, setIsPending ] = useState( false )
  const inputRef = useRef<HTMLInputElement>( null )
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  const handleFileChange = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[ 0 ]
    if ( !file ) return

    setIsPending( true )

    const formData = new FormData()
    formData.append( "file", file )
    formData.append( "noteId", noteId )

    try {
      const res = await fetch( `${ apiUrl }/files/upload`, {
        method: "POST",
        body: formData,
      } )
      toast.success( "File uploaded successfully" )
      router.refresh()
    } catch ( error ) {
      toast.error( "Failed to upload file." )
    } finally {
      setIsPending( false )
      if ( inputRef.current ) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-end">
        <Input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          ref={ inputRef }
          onChange={ handleFileChange }
          disabled={ isPending }
        />

        <Button
          onClick={ () => inputRef.current?.click() }
          disabled={ isPending }
          variant="outline"
          className="gap-2 w-22.5"
        >
          { isPending ? (
            <Loader2 className="h-4 w-4 animate-spin"/>
          ) : (
            <ImagePlus className="h-4 w-4"/>
          ) }
          Upload
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ImageUrlPopover noteId={ noteId }/>
      </div>
    </div>
  )
}

export default UploadFile
