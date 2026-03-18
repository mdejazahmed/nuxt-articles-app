/**
 * Module: use_article_image
 * Creator: assistant
 * Creation Date: 2026-03-18
 * Modification History: Initial creation for resolving article images with placeholder fallback.
 * Summary: Provides a small helper composable to resolve the correct image source for articles, falling back to a shared placeholder when needed.
 * Functions: use_article_image.
 * Variables: resolved_image_src.
 */

import type { ComputedRef } from 'vue'
import type { Article } from '~/models/domain'
import { PLACEHOLDER_ARTICLE_IMAGE } from '~/utils/assets'

interface UseArticleImageResult {
  resolved_image_src: ComputedRef<string>
}

export function use_article_image(article: ComputedRef<Article | null> | Article): UseArticleImageResult
{
  const article_ref: ComputedRef<Article | null> =
    typeof (article as any).value !== 'undefined'
      ? (article as ComputedRef<Article | null>)
      : computed(() =>
      {
        return article as Article
      })

  const resolved_image_src = computed((): string =>
  {
    const current_article = article_ref.value

    if (!current_article)
    {
      return PLACEHOLDER_ARTICLE_IMAGE
    }

    if (!current_article.urlToImage || current_article.urlToImage.trim() === '')
    {
      return PLACEHOLDER_ARTICLE_IMAGE
    }

    return current_article.urlToImage
  })

  return {
    resolved_image_src,
  }
}

