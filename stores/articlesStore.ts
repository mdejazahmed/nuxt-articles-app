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
  }),

  getters: {
    favorite_count(): number {
      return this.favorites.length
    },

    is_favorite(): (id: string) => boolean {
      return (id: string) => this.favorites.includes(id)
    },

    article_by_id(): (id: string) => Article | undefined {
      return (id: string) => this.articles.find((a) => a.id === id)
    },
  },

  actions: {
    set_articles(items: Article[]): void {
      this.articles = items
    },

    toggle_favorite(id: string): void {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) {
        this.favorites.push(id)
      } else {
        this.favorites.splice(idx, 1)
      }
    },
  },
})
 