"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input";

type Props = {
  noteId: string
}

const UploadFile = ( { noteId }: Props ) => {
  const [ isPending, setIsPending ] = useState( false )
  const inputRef = useRef<HTMLInputElement>( null )
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

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

      if ( !res.ok ) {
        throw new Error( "Failed to upload file" )
      }

      router.refresh()
    } catch ( error ) {
      console.error( error )
    } finally {
      setIsPending( false )
      if ( inputRef.current ) {
        inputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <>
      <Input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        ref={ inputRef }
        onChange={ handleFileChange }
        disabled={ isPending }
      />
      <Button
        onClick={ handleButtonClick }
        disabled={ isPending }
        variant="outline"
        className="gap-2"
      >
        { isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <ImagePlus className="h-4 w-4"/> }
        { isPending ? "Uploading..." : "Add Cover" }
      </Button>
    </>
  )
}

export default UploadFile