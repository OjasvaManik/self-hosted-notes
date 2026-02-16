'use client'

import React from 'react'
import { createNoteAction } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react"

const CreateNoteButton = () => {
  const handleCreateNote = async () => {
    await createNoteAction()
  }

  return (
    <Button className={ 'w-full' } variant={ 'default' } onClick={ handleCreateNote }>
      <PlusIcon/>
      <p>Create Note</p>
    </Button>
  )
}
export default CreateNoteButton
