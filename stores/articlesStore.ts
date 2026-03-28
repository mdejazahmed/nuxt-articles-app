/**
 * Pinia store for articles, likes/dislikes, and reading list (saved article IDs).
 * Hydrated from useArticles() on list/detail/saved pages.
 * Reading list IDs persist via `saved-article-ids` cookie (see plugins/reading-list-cookie.ts).
 */

import { defineStore } from 'pinia'
import type { Article } from '~/models/domain'

/** Delay before a scheduled unsave commits (undo window on /saved). */
export const readingListUndoMs = 4000

const removalTimers = new Map<string, ReturnType<typeof setTimeout>>()

/** Clears pending /saved removal timers (used in tests to avoid cross-test leaks). */
export function resetReadingListRemovalTimers(): void {
  removalTimers.forEach((t) => {
    clearTimeout(t)
  })
  removalTimers.clear()
}

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    favorites: [] as string[],
    dislikes: [] as string[],
    viewMode: 'grid' as 'grid' | 'list',
    searchQuery: '',
    savedArticleIds: [] as string[],
    /** IDs currently in the /saved “undo” window (still in savedArticleIds). */
    scheduledRemovalIds: [] as string[],
  }),

  getters: {
    favoriteCount(): number {
      return this.favorites.length
    },

    isLiked(): (id: string) => boolean {
      return (id: string) => this.favorites.includes(id)
    },

    isDisliked(): (id: string) => boolean {
      return (id: string) => this.dislikes.includes(id)
    },

    // Compatibility alias.
    isFavorite(): (id: string) => boolean {
      return (id: string) => this.isLiked(id)
    },

    articleById(): (id: string) => Article | undefined {
      return (id: string) => this.articles.find((a) => a.id === id)
    },

    filteredArticles(): Article[] {
      if (!this.searchQuery) {
        return this.articles
      }

      const needle = this.searchQuery.toLowerCase()

      return this.articles.filter((item) => {
        const title = item.title?.toLowerCase() ?? ''
        const description = item.description?.toLowerCase() ?? ''
        const author = item.author?.toLowerCase() ?? ''
        const sourceName = item.sourceName?.toLowerCase() ?? ''

        return (
          title.includes(needle) ||
          description.includes(needle) ||
          author.includes(needle) ||
          sourceName.includes(needle)
        )
      })
    },

    savedCount(): number {
      return this.savedArticleIds.length
    },

    isSaved(): (id: string) => boolean {
      return (id: string) => this.savedArticleIds.includes(id)
    },

    isScheduledForRemoval(): (id: string) => boolean {
      return (id: string) => this.scheduledRemovalIds.includes(id)
    },

    /** Saved articles in MRU order (savedArticleIds order). */
    savedArticlesOrdered(): Article[] {
      const by_id = new Map(this.articles.map((a) => [a.id, a]))
      return this.savedArticleIds
        .map((id) => by_id.get(id))
        .filter((a): a is Article => a !== undefined)
    },
  },

  actions: {
    setArticles(items: Article[]): void {
      this.articles = items
    },

    toggleLike(id: string): void {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) {
        this.favorites.push(id)
        const dislikeIdx = this.dislikes.indexOf(id)
        if (dislikeIdx !== -1) {
          this.dislikes.splice(dislikeIdx, 1)
        }
      } else {
        this.favorites.splice(idx, 1)
      }
    },

    toggleDislike(id: string): void {
      const idx = this.dislikes.indexOf(id)
      if (idx === -1) {
        this.dislikes.push(id)
        const likeIdx = this.favorites.indexOf(id)
        if (likeIdx !== -1) {
          this.favorites.splice(likeIdx, 1)
        }
      } else {
        this.dislikes.splice(idx, 1)
      }
    },

    toggleFavorite(id: string): void {
      this.toggleLike(id)
    },

    setViewMode(mode: 'grid' | 'list'): void {
      this.viewMode = mode
    },

    setSearchQuery(query: string): void {
      this.searchQuery = query
    },

    /**
     * Adds id to the front of the reading list (MRU). Clears any pending removal for that id.
     */
    saveArticle(id: string): void {
      this.cancelScheduledUnsave(id)
      const next = this.savedArticleIds.filter((x) => x !== id)
      next.unshift(id)
      this.savedArticleIds = next
    },

    /**
     * Removes id immediately from reading list and clears pending removal timers.
     */
    removeSavedArticleImmediate(id: string): void {
      this.cancelScheduledUnsave(id)
      this.savedArticleIds = this.savedArticleIds.filter((x) => x !== id)
    },

    toggleSaveImmediate(id: string): void {
      if (this.savedArticleIds.includes(id)) {
        this.removeSavedArticleImmediate(id)
      } else {
        this.saveArticle(id)
      }
    },

    /**
     * /saved only: start undo window; id stays in savedArticleIds until timer fires.
     */
    scheduleUnsaveFromReadingList(id: string): void {
      if (!this.savedArticleIds.includes(id)) {
        return
      }

      if (this.scheduledRemovalIds.includes(id)) {
        return
      }

      this.scheduledRemovalIds.push(id)
      const timer = setTimeout(() => {
        removalTimers.delete(id)
        this.commitScheduledUnsave(id)
      }, readingListUndoMs)
      removalTimers.set(id, timer)
    },

    cancelScheduledUnsave(id: string): void {
      const t = removalTimers.get(id)
      if (t !== undefined) {
        clearTimeout(t)
        removalTimers.delete(id)
      }

      this.scheduledRemovalIds = this.scheduledRemovalIds.filter((x) => x !== id)
    },

    commitScheduledUnsave(id: string): void {
      if (!this.scheduledRemovalIds.includes(id)) {
        return
      }

      this.scheduledRemovalIds = this.scheduledRemovalIds.filter((x) => x !== id)
      this.savedArticleIds = this.savedArticleIds.filter((x) => x !== id)
    },
  },
})
