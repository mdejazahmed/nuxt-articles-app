/**
 * Reading list: optimistic updates with async storage probe and rollback on failure.
 * Pinia persistedstate syncs savedArticleIds; we verify localStorage is writable after toggles.
 */

import { assertReadingListStorageWritable } from '~/utils/reading-list-persist'

/**
 * Toggles save on list/detail, or starts /saved undo flow; surfaces persist errors briefly.
 */
export function useReadingList() {
  const store = useArticlesStore()
  const persistError = useState<string | null>(
    'reading-list-persist-error',
    () => null,
  )
  let persistErrorTimer: ReturnType<typeof setTimeout> | null = null

  function clearPersistErrorLater(): void {
    if (persistErrorTimer !== null) {
      clearTimeout(persistErrorTimer)
    }

    persistErrorTimer = setTimeout(() => {
      persistError.value = null
      persistErrorTimer = null
    }, 4000)
  }

  /**
   * Immediate save/unsave (list + detail). Rolls back store if storage probe fails.
   */
  async function toggleSaveImmediate(articleId: string): Promise<boolean> {
    persistError.value = null
    const previous = [...store.savedArticleIds]
    store.toggleSaveImmediate(articleId)

    if (import.meta.server) {
      return true
    }

    try {
      await assertReadingListStorageWritable()
      return true
    } catch {
      store.$patch({ savedArticleIds: previous })
      persistError.value = 'Could not update your reading list. Try again.'
      clearPersistErrorLater()
      return false
    }
  }

  /**
   * /saved: begin undo window (id remains saved until timer commits).
   */
  function requestUnsaveOnReadingList(articleId: string): void {
    store.scheduleUnsaveFromReadingList(articleId)
  }

  function cancelUnsaveOnReadingList(articleId: string): void {
    store.cancelScheduledUnsave(articleId)
  }

  return {
    persistError,
    toggleSaveImmediate,
    requestUnsaveOnReadingList,
    cancelUnsaveOnReadingList,
  }
}
