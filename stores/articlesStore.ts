/**
 * Pinia store for articles and optional favorites.
 * Hydrated from useArticles() in the list page to avoid duplicate fetch.
 */

import { defineStore } from 'pinia'
import type { Article } from '~/models/domain'

export const use_articles_store = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    favorites: [] as string[],
    dislikes: [] as string[],
    view_mode: 'grid' as 'grid' | 'list',
    search_query: '',
  }),

  getters: {
    favorite_count(): number {
      return this.favorites.length
    },

    is_liked(): (id: string) => boolean {
      return (id: string) => this.favorites.includes(id)
    },

    is_disliked(): (id: string) => boolean {
      return (id: string) => this.dislikes.includes(id)
    },

    // Backwards-compatible name used by any older pages/components.
    is_favorite(): (id: string) => boolean {
      return (id: string) => this.is_liked(id)
    },

    article_by_id(): (id: string) => Article | undefined {
      return (id: string) => this.articles.find((a) => a.id === id)
    },

    filtered_articles(): Article[] {
      if (!this.search_query) {
        return this.articles
      }

      const needle = this.search_query.toLowerCase()

      return this.articles.filter((item) => {
        const title = item.title?.toLowerCase() ?? ''
        const description = item.description?.toLowerCase() ?? ''
        const author = item.author?.toLowerCase() ?? ''
        const source_name = item.sourceName?.toLowerCase() ?? ''

        return (
          title.includes(needle) ||
          description.includes(needle) ||
          author.includes(needle) ||
          source_name.includes(needle)
        )
      })
    },
  },

  actions: {
    set_articles(items: Article[]): void {
      this.articles = items
    },

    toggle_like(id: string): void {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) {
        this.favorites.push(id)
        // Dislike and like are mutually exclusive (dislike cancels like).
        const dislike_idx = this.dislikes.indexOf(id)
        if (dislike_idx !== -1) {
          this.dislikes.splice(dislike_idx, 1)
        }
      } else {
        this.favorites.splice(idx, 1)
      }
    },

    toggle_dislike(id: string): void {
      const idx = this.dislikes.indexOf(id)
      if (idx === -1) {
        this.dislikes.push(id)
        // Dislike and like are mutually exclusive (dislike cancels like).
        const like_idx = this.favorites.indexOf(id)
        if (like_idx !== -1) {
          this.favorites.splice(like_idx, 1)
        }
      } else {
        this.dislikes.splice(idx, 1)
      }
    },

    toggle_favorite(id: string): void {
      // Keep the older store API name but route to the new like behavior.
      this.toggle_like(id)
    },

    set_view_mode(mode: 'grid' | 'list'): void {
      this.view_mode = mode
    },

    set_search_query(query: string): void {
      this.search_query = query
    },
  },
})
 