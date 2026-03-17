/**
 * Articles feature composable.
 * Uses useAsyncData + useAPI for SSR; maps API response to domain model.
 * Exposes articles, pending, error, refresh. No direct API calls in pages.
 */

import type { Article } from '~/models/domain'
import { map_article_api_to_domain } from '~/models/domain'
import { is_api_success } from '~/types'
import { get_articles } from '~/composables/useAPI'

const KEY_ARTICLES = 'articles'

/**
 * Fetches articles with SSR support and stable key to avoid duplicate client request.
 * Returns normalized domain articles and loading/error state.
 */
export function useArticles() {
  const { data, pending, error, refresh } = useAsyncData(
    KEY_ARTICLES, 
    async (): Promise<Article[]> => {
      const response = await get_articles()
      if (!is_api_success(response)) {
        throw new Error(response.error.message)
      }
      const raw_list = response.data.articles
      if (!Array.isArray(raw_list)) {
        return []
      }
      return raw_list.map((raw, index) => map_article_api_to_domain(raw, index))
    },
    {
      server: true,
      lazy: false,
    }
  )

  const articles = computed(() => data.value ?? [])
  const error_message = computed(() => {
    if (!error.value) return null
    return error.value.message ?? 'Something went wrong'
  })

  return {
    articles,
    pending,
    error: error_message,
    refresh,
  }
}
