/**
 * Shared API types and discriminated unions for responses.
 */

export type ApiStatus = 'idle' | 'pending' | 'success' | 'error'

export interface ApiResponseSuccess<T> {
  data: T
  error: null
  status: 'success'
}

export interface ApiResponseError {
  data: null
  error: { message: string; code?: string }
  status: 'error'
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError

export function is_api_error<T>(res: ApiResponse<T>): res is ApiResponseError {
  return res.status === 'error'
}

export function is_api_success<T>(res: ApiResponse<T>): res is ApiResponseSuccess<T> {
  return res.status === 'success'
}
