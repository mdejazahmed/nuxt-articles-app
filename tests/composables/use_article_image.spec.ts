import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { use_article_image } from '~/composables/use_article_image'
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

describe('use_article_image', () =>
{
  it('returns placeholder when article is null', () =>
  {
    const article_ref = computed(() => null as Article | null)
    const { resolved_image_src } = use_article_image(article_ref)

    expect(resolved_image_src.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })

  it('returns placeholder when urlToImage is empty', () =>
  {
    const article = build_article('a1', { urlToImage: '' })
    const { resolved_image_src } = use_article_image(article)

    expect(resolved_image_src.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })

  it('switches to placeholder after handle_image_error', () =>
  {
    const article = build_article('a2', { urlToImage: 'https://example.test/img.jpg' })
    const { resolved_image_src, handle_image_error } = use_article_image(article)

    expect(resolved_image_src.value).toBe('https://example.test/img.jpg')

    handle_image_error()
    expect(resolved_image_src.value).toBe(PLACEHOLDER_ARTICLE_IMAGE)
  })
})

