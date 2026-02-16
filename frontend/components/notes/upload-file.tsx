"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImagePlus, Link as LinkIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { updateImgUrlAction } from "@/actions/actions"

type Props = {
  noteId: string
}

const UploadFile = ( { noteId }: Props ) => {
  const [ isPending, setIsPending ] = useState( false )
  const [ urlInput, setUrlInput ] = useState( "" )
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

      if ( !res.ok ) throw new Error( "Failed to upload file" )

      router.refresh()
    } finally {
      setIsPending( false )
      if ( inputRef.current ) inputRef.current.value = ""
    }
  }

  const handleUrlSubmit = async () => {
    if ( !urlInput.trim() ) return

    setIsPending( true )
    try {
      await updateImgUrlAction( noteId, urlInput.trim() )
      setUrlInput( "" )
      router.refresh()
    } finally {
      setIsPending( false )
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
          className="gap-2"
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
        <Input
          placeholder="Paste image URL..."
          value={ urlInput }
          onChange={ ( e ) => setUrlInput( e.target.value ) }
          disabled={ isPending }
          className="w-64"
        />

        <Button
          onClick={ handleUrlSubmit }
          disabled={ isPending || !urlInput.trim() }
          variant="outline"
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4"/>
          Add URL
        </Button>
      </div>
    </div>
  )
}

export default UploadFile
