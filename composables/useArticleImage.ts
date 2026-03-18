/**
 * Module: useArticleImage
 * Creator: assistant
 * Creation Date: 2026-03-18
 * Modification History:
 * - 2026-03-18: created as Nuxt-style camelCase replacement for the previous snake_case composable.
 * Summary: Resolves an article image src with a shared placeholder fallback.
 * Functions:
 * - useArticleImage
 * Variables accessed:
 * - resolvedImageSrc, handleImageError, didImageError
 */

import type { ComputedRef, Ref } from 'vue'
import type { Article } from '~/models/domain'
import { PLACEHOLDER_ARTICLE_IMAGE } from '~/utils/assets'

interface UseArticleImageResult
{
  resolvedImageSrc: ComputedRef<string>
  handleImageError: () => void
}

/**
 * Resolves the correct image source for an article.
 * - Uses `PLACEHOLDER_ARTICLE_IMAGE` when the article or `urlToImage` is missing/empty.
 * - After a render error, keeps showing the placeholder for this instance.
 */
export function useArticleImage(
  article: ComputedRef<Article | null> | Article,
): UseArticleImageResult
{
  const didImageError: Ref<boolean> = ref(false)

  const articleRef: ComputedRef<Article | null> = isRef(article)
    ? (article as ComputedRef<Article | null>)
    : computed(() => article as Article)

  const resolvedImageSrc = computed((): string =>
  {
    const currentArticle = articleRef.value

    if (!currentArticle)
    {
      return PLACEHOLDER_ARTICLE_IMAGE
    }

    if (!currentArticle.urlToImage || currentArticle.urlToImage.trim() === '')
    {
      return PLACEHOLDER_ARTICLE_IMAGE
    }

    if (didImageError.value)
    {
      return PLACEHOLDER_ARTICLE_IMAGE
    }

    return currentArticle.urlToImage
  })

  const handleImageError = (): void =>
  {
    didImageError.value = true
  }

  return {
    resolvedImageSrc,
    handleImageError,
  }
}

