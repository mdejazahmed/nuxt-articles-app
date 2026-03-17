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
export function map_article_api_to_domain(raw: ArticleApi, index: number): Article {
  const title = normalize_string(raw.title, UNTITLED)
  const description = normalize_string(raw.description, '')
  const author = normalize_string(raw.author, UNKNOWN_AUTHOR)
  const source_name = raw.source?.name != null ? String(raw.source.name).trim() || UNKNOWN_SOURCE : UNKNOWN_SOURCE
  const url = typeof raw.url === 'string' && raw.url.trim() ? raw.url.trim() : '#'
  const url_to_image =
    typeof raw.urlToImage === 'string' && raw.urlToImage.trim() ? raw.urlToImage.trim() : null
  const published_at = typeof raw.publishedAt === 'string' ? raw.publishedAt : ''
  const content = normalize_string(raw.content, '')

  return {
    id: `article-${index}`,
    title: title === REMOVED_PLACEHOLDER ? UNTITLED : title,
    description: description === REMOVED_PLACEHOLDER ? '' : description,
    author: author === REMOVED_PLACEHOLDER ? UNKNOWN_AUTHOR : author,
    sourceName: source_name === REMOVED_PLACEHOLDER ? UNKNOWN_SOURCE : source_name,
    url,
    urlToImage: url_to_image,
    publishedAt: published_at,
    content: content === REMOVED_PLACEHOLDER ? '' : content,
  }
}

function normalize_string(value: string | null | undefined, fallback: string): string {
  if (value == null) return fallback
  const s = String(value).trim()
  return s === '' ? fallback : s
}
