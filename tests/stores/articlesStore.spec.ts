import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  useArticlesStore,
  resetReadingListRemovalTimers,
  readingListUndoMs,
} from '~/stores/articlesStore'
import type { Article } from '~/models/domain'

function buildArticle(articleId: string, overrides: Partial<Article>): Article
{
  const baseArticle: Article = {
    id: articleId,
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
    ...baseArticle,
    ...overrides,
    id: articleId,
  }
}

describe('articlesStore', () =>
{
  let store!: ReturnType<typeof useArticlesStore>

  beforeEach(() =>
  {
    resetReadingListRemovalTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useArticlesStore()
  })

  afterEach(() =>
  {
    resetReadingListRemovalTimers()
    vi.useRealTimers()
  })

  it('filters articles across multiple fields (case-insensitive)', () =>
  {
    const article1 = buildArticle('a1', {
      title: 'Nuxt tips',
      description: 'Teal background',
      author: 'Alice',
      sourceName: 'Teal News',
    })

    const article2 = buildArticle('a2', {
      title: 'Vue world',
      description: 'Something else',
      author: 'Bob',
      sourceName: 'Blue Daily',
    })

    store.setArticles([article1, article2])

    store.setSearchQuery('teal')
    const filtered = store.filteredArticles

    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('a1')
  })

  it('keeps like/dislike mutually exclusive', () =>
  {
    const targetId = 'article-1'

    store.toggleLike(targetId)
    expect(store.favorites).toContain(targetId)
    expect(store.dislikes).not.toContain(targetId)

    store.toggleDislike(targetId)
    expect(store.dislikes).toContain(targetId)
    expect(store.favorites).not.toContain(targetId)

    store.toggleLike(targetId)
    expect(store.favorites).toContain(targetId)
    expect(store.dislikes).not.toContain(targetId)
  })

  it('toggleLike removes the favorite when called twice', () =>
  {
    const targetId = 'article-2'

    store.toggleLike(targetId)
    expect(store.favorites).toContain(targetId)

    store.toggleLike(targetId)
    expect(store.favorites).not.toContain(targetId)
  })

  it('toggleFavorite is a backwards-compatible alias', () =>
  {
    const targetId = 'article-3'

    store.toggleFavorite(targetId)
    expect(store.favorites).toContain(targetId)
  })

  it('keeps reading list independent from likes', () =>
  {
    const id = 'article-rl-1'

    store.toggleLike(id)
    store.saveArticle(id)

    expect(store.favorites).toContain(id)
    expect(store.savedArticleIds).toContain(id)

    store.toggleLike(id)
    expect(store.favorites).not.toContain(id)
    expect(store.savedArticleIds).toContain(id)
  })

  it('orders saved articles MRU (most recent first)', () =>
  {
    store.saveArticle('a')
    store.saveArticle('b')
    store.saveArticle('a')

    expect(store.savedArticleIds).toEqual(['a', 'b'])
  })

  it('scheduled unsave keeps id in savedArticleIds until timer commits', () =>
  {
    vi.useFakeTimers()
    store.saveArticle('x')

    store.scheduleUnsaveFromReadingList('x')
    expect(store.savedArticleIds).toContain('x')
    expect(store.scheduledRemovalIds).toContain('x')

    vi.advanceTimersByTime(readingListUndoMs - 1)
    expect(store.savedArticleIds).toContain('x')

    vi.advanceTimersByTime(1)
    expect(store.savedArticleIds).not.toContain('x')
    expect(store.scheduledRemovalIds).not.toContain('x')
  })

  it('cancelScheduledUnsave clears undo window and keeps the article saved', () =>
  {
    vi.useFakeTimers()
    store.saveArticle('y')

    store.scheduleUnsaveFromReadingList('y')
    store.cancelScheduledUnsave('y')

    vi.advanceTimersByTime(readingListUndoMs)
    expect(store.savedArticleIds).toContain('y')
    expect(store.scheduledRemovalIds).not.toContain('y')
  })

  it('removeSavedArticleImmediate clears a pending scheduled unsave', () =>
  {
    vi.useFakeTimers()
    store.saveArticle('z')

    store.scheduleUnsaveFromReadingList('z')
    store.removeSavedArticleImmediate('z')

    vi.advanceTimersByTime(readingListUndoMs)
    expect(store.savedArticleIds).not.toContain('z')
  })
})
