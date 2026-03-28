/**
 * Reading list: immediate toggles validate cookie size before mutating; cookie sync runs via plugin watch.
 * User feedback uses useToast (success / info + Undo / error).
 */

import { assertSavedArticleIdsFitCookie } from '~/utils/reading-list-cookie'

/**
 * Toggles save on list/detail, or starts /saved undo flow; surfaces errors via toast.
 */
export function useReadingList() {
  const store = useArticlesStore()
  const toast = useToast()

  /**
   * Immediate save/unsave (list + detail). Client validates cookie size before mutating.
   */
  function toggleSaveImmediate(articleId: string): boolean {
    const current = [...store.savedArticleIds]
    const wasSaved = store.isSaved(articleId)
    const nextIds = wasSaved
      ? current.filter((id) => id !== articleId)
      : [articleId, ...current.filter((id) => id !== articleId)]

    if (import.meta.client) {
      try {
        assertSavedArticleIdsFitCookie(nextIds)
      } catch {
        toast.error('Could not update your reading list. Try again.')
        return false
      }
    }

    store.toggleSaveImmediate(articleId)
    const nowSaved = store.isSaved(articleId)

    if (import.meta.server) {
      return true
    }

    if (nowSaved) {
      toast.success('Article saved')
    } else {
      toast.info('Removed from reading list', {
        action: {
          label: 'Undo',
          onClick: (): void => {
            toggleSaveImmediate(articleId)
          },
        },
      })
    }
    return true
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
