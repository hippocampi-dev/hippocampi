"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteAvailabilityProps {
  availabilityId: string
  className?: string
}

export function DeleteAvailability({ availabilityId, className }: DeleteAvailabilityProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const handleDelete = async () => {
    if (isDeleting) return
    
    try {
      setIsDeleting(true)
      const response = await fetch('/api/db/doctor/availability/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availabilityId }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success("Availability removed successfully")
        // Refresh the current page
        router.refresh()
      } else {
        toast.error("Failed to remove availability", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete availability"
    >
      <X className="h-3 w-3" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}
