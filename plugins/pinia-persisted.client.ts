/**
 * Registers Pinia persisted state so reading list IDs survive refresh.
 */

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaPluginPersistedstate)
})
