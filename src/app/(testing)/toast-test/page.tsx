"use client"

import { useToast } from "~/app/contexts/ToastContext"
import { Button } from "~/components/ui/button"

export default function ToastTestPage() {
  const { toast } = useToast()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button
        onClick={() => {
          console.log("Button clicked, triggering toast")
          toast({
            title: "Toast Test",
            description: "If you can see this, your toast system is working!",
          })
        }}
      >
        Show Toast
      </Button>
    </div>
  )
}