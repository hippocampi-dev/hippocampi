"use client"

import { useEffect, useState, useRef, useCallback } from "react"

type IdleTimerProps = {
  timeout: number
  onIdle: () => void
  onActive?: () => void
  debounce?: number
  events?: string[]
}

export function useIdleTimer({
  timeout,
  onIdle,
  onActive,
  debounce = 500,
  events = ["mousedown", "mousemove", "keydown", "touchstart", "click", "scroll"],
}: IdleTimerProps) {
  const [isIdle, setIsIdle] = useState(false)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (isIdle) {
      setIsIdle(false)
      onActive?.()
    }

    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
    }

    idleTimer.current = setTimeout(() => {
      setIsIdle(true)
      onIdle()
    }, timeout)
  }, [isIdle, onActive, onIdle, timeout])

  const handleActivity = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(resetTimer, debounce)
  }, [debounce, resetTimer])

  useEffect(() => {
    // Initialize timer
    resetTimer()

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [events, handleActivity, resetTimer])

  return { isIdle, reset: resetTimer }
}