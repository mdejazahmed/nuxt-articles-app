/**
 * Articles feature composable.
 * Uses useAsyncData + useAPI for SSR; maps API response to domain model.
 * Exposes articles, pending, error, refresh. No direct API calls in pages.
 */

import type { Article } from '~/models/domain'
import { mapArticleApiToDomain } from '~/models/domain'
import { isApiSuccess } from '~/types'
import { getArticles } from '~/composables/useAPI'

const KEY_ARTICLES = 'articles'

/**
 * Fetches articles with SSR support and stable key to avoid duplicate client request.
 * Returns normalized domain articles and loading/error state.
 */
export function useArticles() {
  const { data, pending, error, refresh } = useAsyncData(
    KEY_ARTICLES, 
    async (): Promise<Article[]> => {
      const response = await getArticles()
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message)
      }
      const rawList = response.data.articles
      if (!Array.isArray(rawList)) {
        return []
      }
      return rawList.map((raw, index) => mapArticleApiToDomain(raw, index))
    },
    {
      server: true,
      lazy: false,
    }
  )

  const articles = computed(() => data.value ?? [])
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message ?? 'Something went wrong'
  })

  return {
    articles,
    pending,
    error: errorMessage,
    refresh,
  }
}
