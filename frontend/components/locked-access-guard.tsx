'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const LockedAccessGuard = ( { children }: { children: React.ReactNode } ) => {
  const router = useRouter()
  const [ authorized, setAuthorized ] = useState( false )

  useEffect( () => {
    const item = localStorage.getItem( "locked_access" )

    if ( !item ) {
      router.replace( "/" )
      return
    }

    try {
      const parsed = JSON.parse( item )

      if ( Date.now() > parsed.expiry ) {
        localStorage.removeItem( "locked_access" )
        router.replace( "/" )
        return
      }

      setAuthorized( true )

    } catch {
      localStorage.removeItem( "locked_access" )
      router.replace( "/" )
    }
  }, [ router ] )

  if ( !authorized ) return null

  return <>{ children }</>
}

export default LockedAccessGuard
