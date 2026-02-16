"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ArrowDownToLine, Blinds } from "lucide-react"

type Props = { tags: string[] }

export const NotesFilter = ( { tags }: Props ) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = ( val: string ) => {
    const params = new URLSearchParams( searchParams.toString() )
    params.set( 'filter', val )
    router.push( `?${ params.toString() }` )
  }

  const handleSortChange = ( val: string ) => {
    const params = new URLSearchParams( searchParams.toString() )
    params.set( 'sortDir', val.toUpperCase() )
    router.push( `?${ params.toString() }` )
  }

  return (
    <div className='space-y-1'>
      <Select onValueChange={ handleFilterChange }>
        <SelectTrigger className='min-w-full'>
          <Blinds className="w-4 h-4 mr-2"/>
          <SelectValue placeholder='Filter'/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Views</SelectLabel>
            <SelectItem value="all">All Notes</SelectItem>
            <SelectItem value="pinned">Pinned</SelectItem>
          </SelectGroup>
          <SelectSeparator/>
          <SelectGroup>
            <SelectLabel>Tags</SelectLabel>
            { tags.map( ( tag ) => (
              <SelectItem key={ tag } value={ tag }>{ tag }</SelectItem>
            ) ) }
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={ handleSortChange } defaultValue="desc">
        <SelectTrigger className='min-w-full'>
          <ArrowDownToLine className="w-4 h-4 mr-2"/>
          <SelectValue placeholder='Sort Order'/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order</SelectLabel>
            <SelectItem value="asc">Oldest First</SelectItem>
            <SelectItem value="desc">Newest First</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}