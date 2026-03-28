<template>
  <div class="min-h-screen bg-slate-100">
    <AppHeader
      :showViewToggle="showLayoutToggle"
      :showSearchToggle="isArticlesIndex"
      :viewMode="articlesStore.viewMode"
      :savedCount="articlesStore.savedCount"
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
 * Index and /saved share the grid–list view toggle; search is index-only.
 */

const route = useRoute()
const articlesStore = useArticlesStore()

const isArticlesIndex = computed(() => route.name === 'index')

const showLayoutToggle = computed(
  () => route.name === 'index' || route.name === 'saved',
)

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
 