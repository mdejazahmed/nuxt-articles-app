import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { use_articles_store } from '~/stores/articlesStore'
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

describe('articlesStore', () =>
{
  let store!: ReturnType<typeof use_articles_store>

  beforeEach(() =>
  {
    setActivePinia(createPinia())
    store = use_articles_store()
  })

  it('filters articles across multiple fields (case-insensitive)', () =>
  {
    const article_1 = build_article('a1', {
      title: 'Nuxt tips',
      description: 'Teal background',
      author: 'Alice',
      sourceName: 'Teal News',
    })

    const article_2 = build_article('a2', {
      title: 'Vue world',
      description: 'Something else',
      author: 'Bob',
      sourceName: 'Blue Daily',
    })

    store.set_articles([article_1, article_2])

    store.set_search_query('teal')
    const filtered = store.filtered_articles

    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('a1')
  })

  it('keeps like/dislike mutually exclusive', () =>
  {
    const target_id = 'article-1'

    store.toggle_like(target_id)
    expect(store.favorites).toContain(target_id)
    expect(store.dislikes).not.toContain(target_id)

    store.toggle_dislike(target_id)
    expect(store.dislikes).toContain(target_id)
    expect(store.favorites).not.toContain(target_id)

    store.toggle_like(target_id)
    expect(store.favorites).toContain(target_id)
    expect(store.dislikes).not.toContain(target_id)
  })

  it('toggle_like removes the favorite when called twice', () =>
  {
    const target_id = 'article-2'

    store.toggle_like(target_id)
    expect(store.favorites).toContain(target_id)

    store.toggle_like(target_id)
    expect(store.favorites).not.toContain(target_id)
  })

  it('toggle_favorite is a backwards-compatible alias', () =>
  {
    const target_id = 'article-3'

    store.toggle_favorite(target_id)
    expect(store.favorites).toContain(target_id)
  })
})

