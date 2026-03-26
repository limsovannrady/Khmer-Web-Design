import { useState, useEffect } from "react"

export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let memoryState: ToastProps | null = null
let listeners: Array<(state: ToastProps | null) => void> = []

export function toast(props: ToastProps) {
  memoryState = props
  listeners.forEach((listener) => listener(memoryState))
  
  setTimeout(() => {
    memoryState = null
    listeners.forEach((listener) => listener(memoryState))
  }, 3000)
}

export function useToast() {
  const [state, setState] = useState<ToastProps | null>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])

  return { toast: state, showToast: toast }
}
