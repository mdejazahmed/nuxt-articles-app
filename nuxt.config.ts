// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-17',
  devtools: { enabled: true },
  css: ['~/assets/css/motion.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon'],
  image: {
    // Pass-through mode: keep remote `src` URLs as-is (no `/.netlify/images?...` rewriting).
    provider: 'none',
  },
  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components/common', pathPrefix: false },
  ],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://mocki.io/v1/50422b19-547f-41c0-b623-e82d886ad264',
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Articles',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
}) 
