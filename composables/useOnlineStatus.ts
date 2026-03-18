/**
 * Module: useOnlineStatus
 * Creator: assistant
 * Creation Date: 2026-03-18
 * Modification History:
 * - 2026-03-18: initial version.
 * Summary:
 * - Tracks browser online/offline state and provides a retry action that refreshes Nuxt data
 *   once connectivity is back.
 * Functions:
 * - useOnlineStatus(): returns { isOnline, retry }
 * Variables accessed:
 * - navigator.onLine, window online/offline events
 */

interface UseOnlineStatusResult {
  isOnline: Readonly<Ref<boolean>>
  retry: () => Promise<void>
}

function readNavigatorOnline(): boolean {
  if (!import.meta.client) {
    return true
  }

  if (typeof navigator === 'undefined') {
    return true
  }

  return navigator.onLine
}

export function useOnlineStatus(): UseOnlineStatusResult {
  const isOnline = ref<boolean>(readNavigatorOnline())

  function syncStatusFromBrowser(): void {
    isOnline.value = readNavigatorOnline()
  }

  async function retry(): Promise<void> {
    syncStatusFromBrowser()

    if (!isOnline.value) {
      return
    }

    await refreshNuxtData()
  }

  onMounted(() => {
    syncStatusFromBrowser()

    window.addEventListener('online', syncStatusFromBrowser)
    window.addEventListener('offline', syncStatusFromBrowser)
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) {
      return
    }

    window.removeEventListener('online', syncStatusFromBrowser)
    window.removeEventListener('offline', syncStatusFromBrowser)
  })

  return {
    isOnline: readonly(isOnline),
    retry,
  }
}

