import { describe, expect, it, beforeEach, vi } from 'vitest'
import type { ArticlesResponseApi } from '~/models/api/articles'
import { getArticles } from '~/composables/useAPI'

describe('useAPI getArticles', () =>
{
  beforeEach(() =>
  {
    vi.resetAllMocks()
  })

  it('returns success response when $fetch resolves', async () =>
  {
    const api_base_url = 'https://example.test/api/articles'
    const fetch_payload: ArticlesResponseApi = {
      articles: [
        {
          source: { id: null, name: 'Example source' },
          author: 'Example author',
          title: 'Example title',
          description: 'Example description',
          url: 'https://example.test/article',
          urlToImage: 'https://example.test/img.jpg',
          publishedAt: '2020-01-01T00:00:00Z',
          content: 'Example content',
        },
      ],
    }

    globalThis.useRuntimeConfig = vi.fn(() => ({
      public: { apiBaseUrl: api_base_url },
    }))

    const fetch_mock = vi.fn(async () => fetch_payload)
    globalThis.$fetch = fetch_mock

    const res = await getArticles()

    expect(fetch_mock).toHaveBeenCalledWith(api_base_url, { timeout: 10_000 })
    expect(res.status).toBe('success')
    if (res.status === 'success')
    {
      expect(res.error).toBeNull()
      expect(res.data.articles).toHaveLength(1)
    }
  })

  it('returns error response when $fetch rejects', async () =>
  {
    const api_base_url = 'https://example.test/api/articles'

    globalThis.useRuntimeConfig = vi.fn(() => ({
      public: { apiBaseUrl: api_base_url },
    }))

    const fetch_mock = vi.fn(async () =>
    {
      const err = Object.assign(new Error('Not Found'), { statusCode: 404 })
      throw err
    })
    globalThis.$fetch = fetch_mock

    const res = await getArticles()

    expect(fetch_mock).toHaveBeenCalledWith(api_base_url, { timeout: 10_000 })
    expect(res.status).toBe('error')
    if (res.status === 'error')
    {
      expect(res.data).toBeNull()
      expect(res.error.message).toBe('Not Found')
      expect(res.error.code).toBe('404')
    }
  })
})

