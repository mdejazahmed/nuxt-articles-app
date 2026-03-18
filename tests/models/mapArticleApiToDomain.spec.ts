import { describe, expect, it } from 'vitest'
import type { ArticleApi } from '~/models/api/articles'
import { mapArticleApiToDomain } from '~/models/domain'

describe('mapArticleApiToDomain', () =>
{
  it('normalizes [Removed] placeholders and trims strings', () =>
  {
    const rawArticleApi: ArticleApi = {
      title: '[Removed]',
      description: '[Removed]',
      author: '[Removed]',
      source: { id: null, name: '[Removed]' },
      url: ' https://example.test/article ',
      urlToImage: ' https://example.test/image.jpg ',
      publishedAt: '2020-01-01T00:00:00Z',
      content: '[Removed]',
    }

    const article = mapArticleApiToDomain(rawArticleApi, 2)

    expect(article.id).toBe('article-2')
    expect(article.title).toBe('Untitled')
    expect(article.description).toBe('')
    expect(article.author).toBe('Unknown author')
    expect(article.sourceName).toBe('Unknown source')
    expect(article.url).toBe('https://example.test/article')
    expect(article.urlToImage).toBe('https://example.test/image.jpg')
    expect(article.publishedAt).toBe('2020-01-01T00:00:00Z')
    expect(article.content).toBe('')
  })

  it('falls back for null/empty fields', () =>
  {
    const rawArticleApi: ArticleApi = {
      title: null,
      description: undefined,
      author: undefined,
      source: null,
      url: '   ',
      urlToImage: '  ',
      publishedAt: null,
      content: undefined,
    }

    const article = mapArticleApiToDomain(rawArticleApi, 0)

    expect(article.id).toBe('article-0')
    expect(article.title).toBe('Untitled')
    expect(article.description).toBe('')
    expect(article.author).toBe('Unknown author')
    expect(article.sourceName).toBe('Unknown source')
    expect(article.url).toBe('#')
    expect(article.urlToImage).toBeNull()
    expect(article.publishedAt).toBe('')
    expect(article.content).toBe('')
  })
})

