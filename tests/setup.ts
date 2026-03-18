import { computed, isRef, ref } from 'vue'
import { vi } from 'vitest'

/**
 * Test shim:
 * - Vue composables in this Nuxt app rely on auto-imported globals like `ref`, `computed`, `isRef`.
 * - Nuxt composables (e.g. `useAPI`) also rely on `useRuntimeConfig()` and `$fetch`.
 * This file wires minimal runtime stubs so pure unit tests can run without a full Nuxt server.
 */

declare global {
  // eslint-disable-next-line no-var
  var ref: typeof ref
  // eslint-disable-next-line no-var
  var computed: typeof computed
  // eslint-disable-next-line no-var
  var isRef: typeof isRef

  // eslint-disable-next-line no-var
  var useRuntimeConfig: () => { public: { apiBaseUrl: string } }

  // eslint-disable-next-line no-var
  var $fetch: <T>(url: string, options?: { timeout?: number }) => Promise<T>
}

globalThis.ref = ref
globalThis.computed = computed
globalThis.isRef = isRef

globalThis.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBaseUrl: 'https://example.test',
  },
}))

globalThis.$fetch = vi.fn(async () => {
  throw new Error('Missing $fetch mock in test')
})

