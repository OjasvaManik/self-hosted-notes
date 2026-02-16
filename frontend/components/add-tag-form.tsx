"use client"

import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { addTagResponseAction } from "@/actions/actions"
import { toast } from "sonner"

const AddTagForm = () => {
  const formRef = useRef<HTMLFormElement>( null )

  const handleAddTag = async ( formData: FormData ) => {
    const tagName = formData.get( "tagName" ) as string
    if ( !tagName || tagName.trim() === "" ) return

    try {
      await addTagResponseAction( tagName )
      toast.success( "Tag added successfully" )
      formRef.current?.reset()
    } catch ( error ) {
      console.error( error )
      toast.error( "Failed to add tag" )
    }
  }

  return (
    <form
      ref={ formRef }
      action={ handleAddTag }
      className="w-full lg:max-w-sm items-center space-y-2"
    >
      <Input
        type="text"
        name="tagName"
        placeholder="New tag name..."
        required
      />
      <Button type="submit" className={ 'w-full' }>
        <Plus className="mr-2 h-4 w-4"/> Add
      </Button>
    </form>
  )
}

export default AddTagForm