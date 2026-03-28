import { watch } from 'vue'

export const SAVED_ARTICLE_IDS_COOKIE_NAME = 'saved-article-ids'

function decodeSavedArticleIdsCookie(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    if (!parsed.every((x): x is string => typeof x === 'string')) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

function encodeSavedArticleIdsCookie(ids: string[]): string {
  return JSON.stringify(ids)
}

/**
 * Hydrates `savedArticleIds` from the request cookie (SSR + client) and keeps the cookie in sync with the store.
 * Invoke once from a Nuxt plugin with `enforce: 'post'`.
 */
export function initSavedArticleIdsCookieSync(): void {
  const store = useArticlesStore()
  const cookie = useCookie<string[]>(SAVED_ARTICLE_IDS_COOKIE_NAME, {
    default: () => [],
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    decode: (value: string) => decodeSavedArticleIdsCookie(value),
    encode: (value: string[]) => encodeSavedArticleIdsCookie(value),
    watch: true,
  })

  store.$patch({ savedArticleIds: [...cookie.value] })

  watch(
    () => store.savedArticleIds.slice(),
    (ids) => {
      cookie.value = ids
    },
  )
}
