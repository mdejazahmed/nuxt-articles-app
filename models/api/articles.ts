/**
 * Raw API response models for the articles endpoint.
 * Reflects the exact shape returned by the API.
 */

export interface ArticleSourceApi {
  id: string | null
  name: string
}

export interface ArticleApi {
  source?: ArticleSourceApi | null
  author?: string | null
  title?: string | null
  description?: string | null
  url?: string | null
  urlToImage?: string | null
  publishedAt?: string | null
  content?: string | null
}

export interface ArticlesResponseApi {
  articles?: ArticleApi[]
}
