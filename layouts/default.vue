<template>
  <div class="min-h-screen bg-slate-100">
    <AppHeader
      :show_view_toggle="is_articles_index"
      :show_search_toggle="is_articles_index"
      :view_mode="articles_store.view_mode"
      @toggle-view="handle_toggle_view"
      @toggle-search="handle_toggle_search"
    />
    <main class="mx-auto max-w-4xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Default layout: header + main content area.
 * For the articles index page, the header also exposes view and search controls
 * that are wired to the articles store and a shared search-open state.
 */

const route = useRoute()
const articles_store = use_articles_store()

const is_articles_index = computed(() => route.name === 'index')

const search_open_state = useState<boolean>('articles-search-open', () => false)

const handle_toggle_view = (): void =>
{
  const next_mode = articles_store.view_mode === 'grid' ? 'list' : 'grid'
  articles_store.set_view_mode(next_mode)
}

const handle_toggle_search = (): void =>
{
  search_open_state.value = !search_open_state.value
}
</script>
 