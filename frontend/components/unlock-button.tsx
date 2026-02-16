// components/UnlockButton.tsx
"use client"

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changeLockStatusAction } from "@/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";

export const UnlockButton = ( { noteId }: { noteId: string } ) => {
  const router = useRouter();

  const handleUnlock = async ( e: React.MouseEvent ) => {
    e.preventDefault()
    e.stopPropagation();
    try {
      await changeLockStatusAction( noteId );
      toast.success( "Note Unlocked" );
      router.refresh(); // Refreshes the server component data
    } catch ( error ) {
      toast.error( "Failed to unlock note" );
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-6 w-6"
      onClick={ handleUnlock }
    >
      <Lock className="w-3 h-3 text-red-500"/>
    </Button>
  );
};