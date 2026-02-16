import React from 'react'
import RemoveTagButton from "@/components/notes/remove-tag-button"

type Props = {
  noteId: string
  tags: string[]
}

const NoteTagsList = ( { noteId, tags }: Props ) => {
  return (
    <div className="flex w-full items-center overflow-x-auto no-scrollbar gap-2 py-2 px-3 lg:h-14">
      { tags.map( tag => (
        <div
          key={ tag }
          className="flex shrink-0 items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium"
        >
          <span>#{ tag }</span>
          <div className="h-4 w-4 flex items-center justify-center">
            <RemoveTagButton
              tagName={ tag }
              noteId={ noteId }
              currentTags={ tags }
            />
          </div>
        </div>
      ) ) }
    </div>
  )
}

export default NoteTagsList
