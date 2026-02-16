'use client'

import React from 'react'
import { Input } from "@/components/ui/input";

type Props = {
  title: string
}

const TitleBar = ( { title }: Props ) => {
  return (
    <Input defaultValue={ title } type="text"
           className={ 'h-14 text-5xl md:text-5xl bg-card dark:bg-card border-0 focus-visible:border-none focus-visible:ring-0 shadow-md max-w-2xl' }/>
  )
}
export default TitleBar
