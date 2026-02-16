"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Toggle } from "@/components/ui/toggle"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [ mounted, setMounted ] = React.useState( false )

  // useEffect only runs on the client, so this sets 'mounted' to true
  // only after the initial hydration is complete.
  React.useEffect( () => {
    setMounted( true )
  }, [] )

  // Render nothing (or a skeleton) during SSR and initial hydration
  // to avoid the mismatch.
  if ( !mounted ) {
    return null
    // Optional: Return a disabled button with same dimensions here
    // to prevent layout shift if you prefer.
  }

  return (
    <Toggle
      variant="outline"
      aria-label="Toggle theme"
      pressed={ theme === "dark" }
      onPressedChange={ () => setTheme( theme === "dark" ? "light" : "dark" ) }
      className={ 'rounded-full h-8 w-8 bg-transparent dark:bg-transparent' }
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
    </Toggle>
  )
}