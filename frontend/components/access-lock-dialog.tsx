'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileLock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { accessLockedNotesWithPasswordAction } from "@/actions/actions"
import { toast } from "sonner"

const TEN_MINUTES = 10 * 60 * 1000

const AccessLockDialog = () => {
  const [ password, setPassword ] = useState( "" )
  const [ loading, setLoading ] = useState( false )
  const router = useRouter()

  const handleSubmit = async () => {
    if ( !password ) return

    try {
      setLoading( true )

      const res = await accessLockedNotesWithPasswordAction( password )

      if ( res ) {
        const expiryTime = Date.now() + TEN_MINUTES

        localStorage.setItem(
          "locked_access",
          JSON.stringify( {
            value: true,
            expiry: expiryTime
          } )
        )

        router.push( "/locked" )
      } else {
        toast.error( "Incorrect Password. Try again." )
      }

    } catch ( error ) {
      toast.error( "Incorrect Password. Try again." )
    } finally {
      setLoading( false )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={ 'secondary' } className={ 'w-full' }>
          <FileLock/>
          <p>Locked</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Note is locked</DialogTitle>
          <DialogDescription>
            Enter Correct Password to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className={ 'space-y-2' }>
          <Input
            type="password"
            placeholder="Password"
            className="w-full text-sm"
            value={ password }
            onChange={ ( e ) => setPassword( e.target.value ) }
            onKeyDown={ ( e ) => {
              if ( e.key === "Enter" ) handleSubmit()
            } }
          />

          <Button
            className="w-full"
            onClick={ handleSubmit }
            disabled={ loading }
          >
            { loading ? "Checking..." : "Submit" }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccessLockDialog
