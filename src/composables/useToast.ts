import { ref, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export const useToast = () => {
  const add = (
    message: string,
    type: ToastType = 'info',
    duration: number = 5000,
    action?: Toast['action']
  ): string => {
    const id = `toast-${Date.now()}-${idCounter++}`

    const toast: Toast = {
      id,
      type,
      message,
      duration,
      action
    }

    toasts.value.push(toast)

    // Auto remove after duration (if duration is not 0)
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (message: string, duration?: number, action?: Toast['action']) => {
    return add(message, 'success', duration, action)
  }

  const error = (message: string, duration?: number, action?: Toast['action']) => {
    return add(message, 'error', duration, action)
  }

  const warning = (message: string, duration?: number, action?: Toast['action']) => {
    return add(message, 'warning', duration, action)
  }

  const info = (message: string, duration?: number, action?: Toast['action']) => {
    return add(message, 'info', duration, action)
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
}
