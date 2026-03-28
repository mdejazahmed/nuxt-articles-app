import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { assertReadingListStorageWritable } from '~/utils/reading-list-persist'

describe('assertReadingListStorageWritable', () =>
{
  const original = globalThis.localStorage

  beforeEach(() =>
  {
    const store: Record<string, string> = {}
    globalThis.localStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
      clear: () => {
        Object.keys(store).forEach((k) => {
          delete store[k]
        })
      },
      key: () => null,
      length: 0,
    } as Storage
  })

  afterEach(() =>
  {
    globalThis.localStorage = original
    vi.restoreAllMocks()
  })

  it('resolves when localStorage is writable', async () =>
  {
    await expect(assertReadingListStorageWritable()).resolves.toBeUndefined()
  })

  it('rejects when setItem throws', async () =>
  {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota')
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage

    await expect(assertReadingListStorageWritable()).rejects.toThrow('quota')
  })
})
