'use client'

import React, { useCallback } from "react"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { updateContentAction } from "@/actions/actions"
import { PartialBlock } from "@blocknote/core"
import { useTheme } from "next-themes"

type Props = {
  noteId: string
  initialContent?: PartialBlock[]
}

const Editor = ( { noteId, initialContent }: Props ) => {
  const { theme } = useTheme()
  const editor = useCreateBlockNote( {
    initialContent
  } )

  const handleChange = useCallback( async () => {
    const content = JSON.stringify( editor.document )
    await updateContentAction( noteId, content )
  }, [ editor, noteId ] )

  return (
    <BlockNoteView
      editor={ editor }
      onChange={ handleChange }
      theme={ theme === "dark" ? "dark" : "light" }
      className="bg-transparent"
      shadCNComponents={ {} }
    />
  )
}

export default Editor
