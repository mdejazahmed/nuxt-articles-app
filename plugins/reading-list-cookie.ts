/**
 * SSR-readable reading list: hydrate Pinia from `saved-article-ids` cookie and write back on changes.
 */

export default defineNuxtPlugin({
  name: 'reading-list-cookie-sync',
  enforce: 'post',
  setup() {
    initSavedArticleIdsCookieSync()
  },
})
