import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { useArticleImage } from '~/composables/useArticleImage'
import { PLACEHOLDER_ARTICLE_IMAGE } from '~/utils/assets'
import type { Article } from '~/models/domain'

function build_article(article_id: string, overrides: Partial<Article>): Article
{
  const base_article: Article = {
    id: article_id,
    title: '',
    description: '',
    author: '',
    sourceName: '',
    url: '#',
    urlToImage: null,
    publishedAt: '',
    content: '',
  }

  return {
    ...base_article,
    ...overrides,
    id: article_id,
  }
}

describe('useArticleImage', () =>
{
  it('returns placeholder when article is null', () =>
  {
    const article_ref = computed(() => null as Article | null)
    const { resolvedImageSrc } = useArticleImage(article_ref)

    expect(resolvedImageSrc.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })

  it('returns placeholder when urlToImage is empty', () =>
  {
    const article = build_article('a1', { urlToImage: '' })
    const { resolvedImageSrc } = useArticleImage(article)

    expect(resolvedImageSrc.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })

  it('switches to placeholder after handleImageError', () =>
  {
    const article = build_article('a2', { urlToImage: 'https://example.test/img.jpg' })
    const { resolvedImageSrc, handleImageError } = useArticleImage(article)

    expect(resolvedImageSrc.value).toBe('https://example.test/img.jpg')

    handleImageError()
    expect(resolvedImageSrc.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })
})

