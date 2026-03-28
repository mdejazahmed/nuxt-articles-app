import { describe, expect, it } from 'vitest'
import {
  assertSavedArticleIdsFitCookie,
  SAVED_ARTICLE_IDS_COOKIE_MAX_ENCODED_CHARS,
} from '~/utils/reading-list-cookie'

describe('assertSavedArticleIdsFitCookie', () => {
  it('allows a small list', () => {
    expect(() => assertSavedArticleIdsFitCookie(['a', 'b'])).not.toThrow()
  })

  it('throws when encoded payload exceeds limit', () => {
    const longId = 'x'.repeat(SAVED_ARTICLE_IDS_COOKIE_MAX_ENCODED_CHARS)
    expect(() => assertSavedArticleIdsFitCookie([longId])).toThrow('too large')
  })
})
