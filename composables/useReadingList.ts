/**
 * Reading list: optimistic updates with async storage probe and rollback on failure.
 * Pinia persistedstate syncs savedArticleIds; we verify localStorage is writable after toggles.
 * User feedback uses useToast (success / info + Undo / error).
 */

import { assertReadingListStorageWritable } from '~/utils/reading-list-persist'

/**
 * Toggles save on list/detail, or starts /saved undo flow; surfaces errors via toast.
 */
export function useReadingList() {
  const store = useArticlesStore()
  const toast = useToast()

  /**
   * Immediate save/unsave (list + detail). Rolls back store if storage probe fails.
   */
  async function toggleSaveImmediate(articleId: string): Promise<boolean> {
    const previous = [...store.savedArticleIds]
    const wasSaved = store.isSaved(articleId)
    store.toggleSaveImmediate(articleId)
    const nowSaved = store.isSaved(articleId)

    if (import.meta.server) {
      return true
    }

    try {
      await assertReadingListStorageWritable()
      if (nowSaved) {
        toast.success('Article saved')
      } else {
        toast.info('Removed from reading list', {
          action: {
            label: 'Undo',
            onClick: (): void => {
              void toggleSaveImmediate(articleId)
            },
          },
        })
      }
      return true
    } catch {
      store.$patch({ savedArticleIds: previous })
      toast.error('Could not update your reading list. Try again.')
      return false
    }
  }

  /**
   * /saved: begin undo window (id remains saved until timer commits).
   */
  function requestUnsaveOnReadingList(articleId: string): void {
    const wasScheduled = store.isScheduledForRemoval(articleId)
    store.scheduleUnsaveFromReadingList(articleId)
    const isScheduled = store.isScheduledForRemoval(articleId)

    if (!import.meta.client) {
      return
    }

    if (!isScheduled || wasScheduled) {
      return
    }

    toast.info('Removing from reading list…', {
      action: {
        label: 'Undo',
        onClick: (): void => {
          cancelUnsaveOnReadingList(articleId)
        },
      },
    })
  }

  function cancelUnsaveOnReadingList(articleId: string): void {
    store.cancelScheduledUnsave(articleId)
  }

  return {
    toggleSaveImmediate,
    requestUnsaveOnReadingList,
    cancelUnsaveOnReadingList,
  }
}
