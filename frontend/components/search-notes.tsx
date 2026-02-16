'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command";
import { CommandItem } from "cmdk";
import { Note } from "@/types/types";
import { SearchIcon } from "lucide-react";
import { getAllNotesForSearchAction } from "@/actions/actions";
import { useRouter } from "next/navigation";

const SearchNotes = () => {
  const [ open, setOpen ] = React.useState( false )
  const [ notes, setNotes ] = React.useState<Note[]>( [] )

  const router = useRouter()

  React.useEffect( () => {
    if ( open ) {
      const fetchData = async () => {
        const notesData = await getAllNotesForSearchAction()
        setNotes( notesData )
      }
      fetchData()
    }
  }, [ open ] )

  return (
    <div className="flex flex-col gap-4">
      <Button variant={ 'outline' } className={ 'w-full flex items-center gap-2 justify-start' }
              onClick={ () => setOpen( true ) }>
        <SearchIcon/>
        <p>Search</p>
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <Command>
          <CommandInput placeholder="Type a command or search..."/>
          <CommandList>
            <CommandGroup heading="Search Notes">
              <CommandEmpty>No results found.</CommandEmpty>
              { notes.map( ( note ) => (
                <CommandItem key={ note.id } value={ note.title }
                             className={ 'px-3 py-1 rounded-xl flex items-center justify-between gap-2 hover:bg-sidebar/50 transition-all' }
                             onSelect={ () => {
                               setOpen( false )
                               router.push( `/note/${ note.id }` )
                             } }
                >
                  <span className={ 'truncate' }>{ note.title }</span>
                </CommandItem>
              ) ) }
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
export default SearchNotes
