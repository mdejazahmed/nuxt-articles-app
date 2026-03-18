/**
 * Domain (UI-safe) article model and mapper from API shape.
 * All display fields have fallbacks so the UI never sees undefined.
 */

import type { ArticleApi } from '../api/articles'

const REMOVED_PLACEHOLDER = '[Removed]'
const UNTITLED = 'Untitled'
const UNKNOWN_SOURCE = 'Unknown source'
const UNKNOWN_AUTHOR = 'Unknown author'

export interface Article {
  id: string
  title: string
  description: string
  author: string
  sourceName: string
  url: string 
  urlToImage: string | null
  publishedAt: string
  content: string
}

/**
 * Normalizes a raw API article into a domain article with safe fallbacks.
 * Filters out or normalizes [Removed] and missing fields.
 */
export function mapArticleApiToDomain(raw: ArticleApi, index: number): Article {
  const title = normalizeString(raw.title, UNTITLED)
  const description = normalizeString(raw.description, '')
  const author = normalizeString(raw.author, UNKNOWN_AUTHOR)
  const sourceName = raw.source?.name != null ? String(raw.source.name).trim() || UNKNOWN_SOURCE : UNKNOWN_SOURCE
  const url = typeof raw.url === 'string' && raw.url.trim() ? raw.url.trim() : '#'
  const urlToImage =
    typeof raw.urlToImage === 'string' && raw.urlToImage.trim() ? raw.urlToImage.trim() : null
  const publishedAt = typeof raw.publishedAt === 'string' ? raw.publishedAt : ''
  const content = normalizeString(raw.content, '')

  return {
    id: `article-${index}`,
    title: title === REMOVED_PLACEHOLDER ? UNTITLED : title,
    description: description === REMOVED_PLACEHOLDER ? '' : description,
    author: author === REMOVED_PLACEHOLDER ? UNKNOWN_AUTHOR : author,
    sourceName: sourceName === REMOVED_PLACEHOLDER ? UNKNOWN_SOURCE : sourceName,
    url,
    urlToImage,
    publishedAt,
    content: content === REMOVED_PLACEHOLDER ? '' : content,
  }
}

function normalizeString(value: string | null | undefined, fallback: string): string {
  if (value == null) return fallback
  const s = String(value).trim()
  return s === '' ? fallback : s
}
