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
    view_mode: 'grid' as 'grid' | 'list',
    search_query: '',
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

    toggle_favorite(id: string): void {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) {
        this.favorites.push(id)
      } else {
        this.favorites.splice(idx, 1)
      }
    },

    set_view_mode(mode: 'grid' | 'list'): void {
      this.view_mode = mode
    },

    set_search_query(query: string): void {
      this.search_query = query
    },
  },
})
 