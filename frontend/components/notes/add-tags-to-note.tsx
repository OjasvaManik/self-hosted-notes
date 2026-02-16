'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { getTagsAction, updateTagsAction } from "@/actions/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

type Props = {
  id: string
  currentTags: string[]
}

const AddTagsToNote = ( { id, currentTags }: Props ) => {
  const [ availableTags, setAvailableTags ] = useState<string[]>( [] )
  const [ loading, setLoading ] = useState( true )
  const [ isPending, startTransition ] = useTransition()
  const [ value, setValue ] = useState<string>( "" )

  useEffect( () => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTagsAction()
        setAvailableTags( tagsData )
      } finally {
        setLoading( false )
      }
    }
    fetchTags()
  }, [] )

  const handleSelect = ( selectedTag: string ) => {
    if ( currentTags.includes( selectedTag ) ) {
      toast.info( "Tag already added to this note" )
      setValue( "" )
      return
    }

    const updatedTags = [ ...currentTags, selectedTag ]

    startTransition( async () => {
      try {
        await updateTagsAction( id, updatedTags )
        toast.success( `Tag #${ selectedTag } added` )
        setValue( "" )
      } catch ( error ) {
        console.error( error )
        toast.error( "Failed to add tag" )
      }
    } )
  }

  return (
    <div className="flex items-center px-3 py-0 mt-0">
      <Select
        value={ value }
        onValueChange={ ( val ) => {
          setValue( val )
          handleSelect( val )
        } }
        disabled={ loading || isPending }
      >
        <SelectTrigger className="w-40 border-0 shadow-md focus-visible:ring-0 focus-visible:border-0">
          <SelectValue placeholder={ loading ? "Loading..." : "Add tag" }/>
        </SelectTrigger>
        <SelectContent>
          { availableTags.length > 0 ? (
            availableTags
              .filter( tag => !currentTags.includes( tag ) )
              .map( tag => (
                <SelectItem key={ tag } value={ tag }>
                  #{ tag }
                </SelectItem>
              ) )
          ) : (
            <SelectItem
              value="__no_tags__"
              className="text-xs text-muted-foreground"
            >
              No tags found
            </SelectItem>
          ) }
        </SelectContent>
      </Select>
    </div>
  )
}

export default AddTagsToNote
