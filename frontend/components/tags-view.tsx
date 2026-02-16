"use client"

import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import DeleteTagButton from "@/components/delete-tag-button"
import AddTagForm from "@/components/add-tag-form"

type Props = {
  initialTags: string[]
}

const TagsView = ( { initialTags }: Props ) => {
  const [ searchQuery, setSearchQuery ] = useState( "" )

  // Filter tags based on search
  const filteredTags = initialTags.filter( tag =>
    tag.toLowerCase().includes( searchQuery.toLowerCase() )
  )

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] gap-4">

      {/* --- TAGS LIST AREA --- */ }
      {/* Mobile: Top, Fixed Height | Desktop: Left, Full Height */ }
      <div className="
        flex flex-col gap-2
        h-62.5 lg:h-full
        w-full lg:w-100 lg:min-w-75
        overflow-y-auto
        shadow-md rounded-md p-4 bg-card
      ">

        <div className="flex flex-wrap gap-2 content-start">
          { filteredTags.length > 0 ? (
            filteredTags.map( tag => (
              <div
                key={ tag }
                className="
                  flex items-center gap-1
                  bg-secondary text-secondary-foreground
                  px-3 py-1 rounded-md text-sm font-medium
                "
              >
                <span>#{ tag }</span>
                <div className="h-4 w-4 flex items-center justify-center">
                  <DeleteTagButton tagName={ tag }/>
                </div>
              </div>
            ) )
          ) : (
            <p className="text-sm text-muted-foreground w-full text-center py-4">
              No tags found.
            </p>
          ) }
        </div>
      </div>

      <Separator className="lg:hidden"/>
      <Separator orientation="vertical" className="hidden lg:block h-full"/>

      {/* --- ACTION AREA --- */ }
      <div className="flex-1 flex flex-col gap-8 p-4">

        {/* Search Section */ }
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Search Tags</h3>
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground"/>
            <Input
              placeholder="Filter tags..."
              className="pl-8"
              value={ searchQuery }
              onChange={ ( e ) => setSearchQuery( e.target.value ) }
            />
          </div>
        </div>

        <Separator/>

        {/* Add Tag Section */ }
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Create New Tag</h3>
          <p className="text-sm text-muted-foreground">
            Add a new tag to organize your notes better.
          </p>
          <AddTagForm/>
        </div>

      </div>
    </div>
  )
}

export default TagsView