"use client"

import type React from "react"

// Inspired by react-hot-toast library
import { useState, useEffect, useCallback } from "react"

import type { ToastActionElement, ToastProps } from "~/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Dismiss a specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }

    case "REMOVE_TOAST": {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  const dispatch = useCallback((action: Action) => {
    setState((prevState) => reducer(prevState, action))
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToasterToast, "id">) => {
      const id = generateId()

      const update = (props: Partial<ToasterToast>) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: { ...props, id },
        })

      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss()
          },
        },
      })

      return {
        id,
        dismiss,
        update,
      }
    },
    [dispatch],
  )

  useEffect(() => {
    state.toasts.forEach((t) => {
      if (!t.open && toastTimeouts.has(t.id)) {
        clearTimeout(toastTimeouts.get(t.id))
        toastTimeouts.delete(t.id)
      }

      if (t.open && !toastTimeouts.has(t.id)) {
        const timeout = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: t.id })
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(t.id, timeout)
      }
    })
  }, [state.toasts, dispatch])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch({ type: "DISMISS_TOAST" })
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [dispatch])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}