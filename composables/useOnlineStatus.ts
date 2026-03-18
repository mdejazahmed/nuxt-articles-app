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
 * - use_online_status(): returns { is_online, retry }
 * Variables accessed:
 * - navigator.onLine, window online/offline events
 */

interface UseOnlineStatusResult {
  is_online: Readonly<Ref<boolean>>
  retry: () => Promise<void>
}

function read_navigator_online(): boolean {
  if (!import.meta.client) {
    return true
  }

  if (typeof navigator === 'undefined') {
    return true
  }

  return navigator.onLine
}

export function use_online_status(): UseOnlineStatusResult {
  const is_online = ref<boolean>(read_navigator_online())

  function sync_status_from_browser(): void {
    is_online.value = read_navigator_online()
  }

  async function retry(): Promise<void> {
    sync_status_from_browser()

    if (!is_online.value) {
      return
    }

    await refreshNuxtData()
  }

  onMounted(() => {
    sync_status_from_browser()

    window.addEventListener('online', sync_status_from_browser)
    window.addEventListener('offline', sync_status_from_browser)
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) {
      return
    }

    window.removeEventListener('online', sync_status_from_browser)
    window.removeEventListener('offline', sync_status_from_browser)
  })

  return {
    is_online: readonly(is_online),
    retry,
  }
}

