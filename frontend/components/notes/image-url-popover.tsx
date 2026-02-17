import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { updateImgUrlAction } from "@/actions/actions";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Check, LinkIcon } from "lucide-react" // Added Check icon
import { Input } from "@/components/ui/input";

type Props = {
  noteId: string
}

const ImageUrlPopover = ( { noteId }: Props ) => {
  const [ isPending, setIsPending ] = useState( false )
  const [ urlInput, setUrlInput ] = useState( "" )
  const [ isOpen, setIsOpen ] = useState( false ) // Control popover state manually to close on submit
  const router = useRouter()

  const handleUrlSubmit = async () => {
    if ( !urlInput.trim() ) return

    setIsPending( true )
    try {
      await updateImgUrlAction( noteId, urlInput.trim() )
      setUrlInput( "" )
      toast.success( "Image URL updated" )
      setIsOpen( false ) // Close popover on success
      router.refresh()
    } catch ( error ) {
      toast.error( "Failed to update image URL" )
    } finally {
      setIsPending( false )
    }
  }

  return (
    <Popover open={ isOpen } onOpenChange={ setIsOpen }>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          disabled={ isPending } // Only disable if currently submitting
        >
          <LinkIcon className="h-4 w-4"/>
          Add URL
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Paste Link</PopoverTitle>
          <PopoverDescription>
            Set the link of the image to be displayed in the note.
          </PopoverDescription>
        </PopoverHeader>

        {/* Input and Save Button Area */ }
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Paste image URL..."
            value={ urlInput }
            onChange={ ( e ) => setUrlInput( e.target.value ) }
            disabled={ isPending }
            onKeyDown={ ( e ) => {
              if ( e.key === "Enter" ) handleUrlSubmit()
            } }
          />
          <Button
            onClick={ handleUrlSubmit }
            disabled={ isPending || !urlInput.trim() }
            size="icon"
          >
            <Check className="h-4 w-4"/>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ImageUrlPopover