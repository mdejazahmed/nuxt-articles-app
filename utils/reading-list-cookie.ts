/**
 * Size guard for reading list cookie (JSON array of IDs). Browsers enforce ~4KB per cookie.
 */

export const SAVED_ARTICLE_IDS_COOKIE_MAX_ENCODED_CHARS = 3500

export function assertSavedArticleIdsFitCookie(ids: string[]): void {
  const encoded = encodeURIComponent(JSON.stringify(ids))
  if (encoded.length > SAVED_ARTICLE_IDS_COOKIE_MAX_ENCODED_CHARS) {
    throw new Error('Reading list is too large to save')
  }
}
