import type { ToastOptions, ToastPublic, ToastVariant } from '~/types/toast'

/** Shared Nuxt useState key; ToastHost reads the same queue. */
export const TOAST_STATE_KEY = 'app-toasts' as const

const toastActionHandlers = new Map<string, () => void>()

function createToastId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Removes a toast and clears any registered action handler.
 */
export function removeToast(id: string): void {
  if (!import.meta.client) {
    return
  }
  toastActionHandlers.delete(id)
  const list = useState<ToastPublic[]>(TOAST_STATE_KEY, () => [])
  list.value = list.value.filter((t) => t.id !== id)
}

/**
 * Runs the optional action registered for a toast (e.g. Undo).
 */
export function runToastAction(id: string): void {
  toastActionHandlers.get(id)?.()
}

export function useToast(): {
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
} {
  const toasts = useState<ToastPublic[]>(TOAST_STATE_KEY, () => [])

  const addToast = (variant: ToastVariant, message: string, options?: ToastOptions): void => {
    if (!import.meta.client) {
      return
    }
    const id = createToastId()
    if (options?.action) {
      toastActionHandlers.set(id, options.action.onClick)
    }
    const row: ToastPublic = {
      id,
      message,
      variant,
      ...(options?.action ? { actionLabel: options.action.label } : {}),
    }
    toasts.value = [row, ...toasts.value]
  }

  return {
    success: (message: string, options?: ToastOptions): void => {
      addToast('success', message, options)
    },
    error: (message: string, options?: ToastOptions): void => {
      addToast('error', message, options)
    },
    info: (message: string, options?: ToastOptions): void => {
      addToast('info', message, options)
    },
  }
}
