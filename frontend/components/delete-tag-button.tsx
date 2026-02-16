'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { deleteTagAction } from "@/actions/actions";
import { toast } from "sonner";

type Props = {
  tagName: string
}

const DeleteTagButton = ( { tagName }: Props ) => {
  const handleDeleteTag = async () => {
    try {
      const result = await deleteTagAction( tagName )
      toast.success( "Tag deleted successfully!" )
    } catch ( error ) {
      toast.error( "Failed to delete tag!" )
    }
  }

  return (
    <Button variant={ 'ghost' } onClick={ handleDeleteTag } className={ 'hover:bg-transparent' }>
      <XIcon/>
    </Button>
  )
}
export default DeleteTagButton
