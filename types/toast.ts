export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastActionOptions {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  action?: ToastActionOptions
}

/** Serializable toast row stored in useState (no functions). */
export interface ToastPublic {
  id: string
  message: string
  variant: ToastVariant
  actionLabel?: string
}
