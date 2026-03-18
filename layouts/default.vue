<template>
  <div class="min-h-screen bg-slate-100">
    <AppHeader
      :showViewToggle="isArticlesIndex"
      :showSearchToggle="isArticlesIndex"
      :viewMode="articlesStore.viewMode"
      @toggle-view="handleToggleView"
      @toggle-search="handleToggleSearch"
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
const articlesStore = useArticlesStore()

const isArticlesIndex = computed(() => route.name === 'index')

const searchOpenState = useState<boolean>('articles-search-open', () => false)

const handleToggleView = (): void =>
{
  const nextMode = articlesStore.viewMode === 'grid' ? 'list' : 'grid'
  articlesStore.setViewMode(nextMode)
}

const handleToggleSearch = (): void =>
{
  searchOpenState.value = !searchOpenState.value
}
</script>
 