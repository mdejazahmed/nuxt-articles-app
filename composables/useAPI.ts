/**
 * Centralized API communication.
 * All HTTP calls to the articles API go through this composable.
 * Handles errors, timeout, and returns typed ApiResponse.
 */

import type { ArticlesResponseApi } from '~/models/api/articles'
import type { ApiResponse } from '~/types'

const DEFAULT_TIMEOUT_MS = 10_000

/**
 * Fetches the articles list from the mock API.
 * Returns a typed ApiResponse; never throws.
 */
export async function get_articles(): Promise<ApiResponse<ArticlesResponseApi>> {
  const config = useRuntimeConfig()
  const url = config.public.apiBaseUrl as string

  try {
    const data = await $fetch<ArticlesResponseApi>(url, {
      timeout: DEFAULT_TIMEOUT_MS,
    })
    return { data, error: null, status: 'success' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch articles'
    const code = err && typeof err === 'object' && 'statusCode' in err ? String((err as { statusCode: number }).statusCode) : undefined
    return {
      data: null,
      error: { message, code },
      status: 'error',
    }
  }
}
