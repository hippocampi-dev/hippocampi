"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useIdleTimer } from "~/hooks/useIdleTimer"

type AutoSignoutContextType = {
  resetIdleTimer: () => void
}

const AutoSignoutContext = createContext<AutoSignoutContextType | undefined>(undefined)

export function useAutoSignout() {
  const context = useContext(AutoSignoutContext)
  if (context === undefined) {
    throw new Error("useAutoSignout must be used within an AutoSignoutProvider")
  }
  return context
}

type AutoSignoutProviderProps = {
  children: ReactNode
  idleTimeout?: number
  warningTime?: number
}

export function AutoSignoutProvider({
  children,
  idleTimeout = 15 * 60 * 1000, // 15 minutes in milliseconds
  warningTime = 60 * 1000, // 1 minute warning before signout
}: AutoSignoutProviderProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(warningTime / 1000)
  const router = useRouter()
  const { data: session } = useSession()
  const countdownInterval = useRef<NodeJS.Timeout | null>(null)

  const handleSignout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  const handleIdle = () => {
    // Only show warning if user is logged in
    if (session) {
      setShowWarning(true)

      // Start countdown
      setCountdown(Math.floor(warningTime / 1000))
      if (countdownInterval.current) clearInterval(countdownInterval.current)

      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current)
            handleSignout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleActive = () => {
    setShowWarning(false)
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current)
    }
  }

  const { reset } = useIdleTimer({
    timeout: idleTimeout - warningTime, // Show warning before actual timeout
    onIdle: handleIdle,
    onActive: handleActive,
  })

  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current)
    }
  }, [])

  return (
    <AutoSignoutContext.Provider value={{ resetIdleTimer: reset }}>
      {children}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Session Timeout Warning
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Your session is about to expire due to inactivity.</p>
            <p className="mt-2">
              You will be automatically signed out in <span className="font-bold">{countdown}</span> seconds.
            </p>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handleSignout}>
              Sign out now
            </Button>
            <Button
              onClick={() => {
                reset()
                setShowWarning(false)
                if (countdownInterval.current) clearInterval(countdownInterval.current)
              }}
            >
              Stay signed in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AutoSignoutContext.Provider>
  )
}