/**
 * Async persistence probe for reading list: used after optimistic updates
 * so we can roll back in-memory state if storage is unavailable.
 */

const STORAGE_PROBE_KEY = '__articles_reading_list_storage_probe__'

/**
 * Runs after state mutation on a microtask; throws if localStorage cannot be written.
 */
export async function assertReadingListStorageWritable(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    queueMicrotask(() => {
      if (typeof localStorage === 'undefined') {
        reject(new Error('localStorage unavailable'))
        return
      }

      try {
        localStorage.setItem(STORAGE_PROBE_KEY, '1')
        localStorage.removeItem(STORAGE_PROBE_KEY)
        resolve()
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Storage write failed'))
      }
    })
  })
}
