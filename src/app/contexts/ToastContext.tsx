"use client"

import type * as React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

import type { ToastActionElement, ToastProps } from "~/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToastContextType = {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id">) => {
    id: string
    dismiss: () => void
    update: (props: Partial<ToasterToast>) => void
  }
  dismiss: (toastId?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prevToasts) => {
      if (toastId) {
        // Dismiss specific toast
        return prevToasts.map((toast) => (toast.id === toastId ? { ...toast, open: false } : toast))
      } else {
        // Dismiss all toasts
        return prevToasts.map((toast) => ({ ...toast, open: false }))
      }
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToasterToast, "id">) => {
      const id = generateId()

      const update = (props: Partial<ToasterToast>) =>
        setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast)))

      const dismissToast = () => dismiss(id)

      setToasts((prevToasts) =>
        [
          {
            ...props,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
              if (!open) dismiss(id)
            },
          },
          ...prevToasts,
        ].slice(0, TOAST_LIMIT),
      )

      return {
        id,
        dismiss: dismissToast,
        update,
      }
    },
    [dismiss],
  )

  useEffect(() => {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

    toasts.forEach((toast) => {
      if (!toast.open && timeouts.has(toast.id)) {
        clearTimeout(timeouts.get(toast.id))
        timeouts.delete(toast.id)
      }

      if (toast.open && !timeouts.has(toast.id) && toast.duration !== Number.POSITIVE_INFINITY) {
        const timeout = setTimeout(() => {
          dismiss(toast.id)
        }, toast.duration || TOAST_REMOVE_DELAY)

        timeouts.set(toast.id, timeout)
      }
    })

    return () => {
      timeouts.forEach((timeout) => {
        clearTimeout(timeout)
      })
    }
  }, [toasts, dismiss])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [dismiss])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}