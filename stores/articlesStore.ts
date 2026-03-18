/**
 * Pinia store for articles and optional favorites.
 * Hydrated from useArticles() in the list page to avoid duplicate fetch.
 */

import { defineStore } from 'pinia'
import type { Article } from '~/models/domain'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    favorites: [] as string[],
    dislikes: [] as string[],
    viewMode: 'grid' as 'grid' | 'list',
    searchQuery: '',
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
  },

  actions: {
    setArticles(items: Article[]): void {
      this.articles = items
    },

    toggleLike(id: string): void {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) {
        this.favorites.push(id)
        // Dislike and like are mutually exclusive (dislike cancels like).
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
        // Dislike and like are mutually exclusive (dislike cancels like).
        const likeIdx = this.favorites.indexOf(id)
        if (likeIdx !== -1) {
          this.favorites.splice(likeIdx, 1)
        }
      } else {
        this.dislikes.splice(idx, 1)
      }
    },

    toggleFavorite(id: string): void {
      // Kept as a friendly alias; favorites map to likes.
      this.toggleLike(id)
    },

    setViewMode(mode: 'grid' | 'list'): void {
      this.viewMode = mode
    },

    setSearchQuery(query: string): void {
      this.searchQuery = query
    },
  },
})
 