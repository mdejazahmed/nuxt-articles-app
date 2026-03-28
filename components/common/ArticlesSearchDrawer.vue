<template>
  <Teleport to="body">
    <div
      v-if="isArticlesIndex"
      class="pointer-events-none fixed inset-0 z-[60] flex justify-end"
      :class="{ 'pointer-events-auto': isOpen }"
      aria-hidden="true"
    >
      <Transition name="drawer-backdrop">
        <div
          v-if="isOpen"
          class="absolute inset-0 bg-slate-900/50"
          aria-hidden="true"
          @click="close"
        />
      </Transition>
      <Transition name="drawer-panel">
        <aside
          v-if="isOpen"
          class="pointer-events-auto relative flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="articles-search-drawer-title"
          tabindex="-1"
          @keydown.esc.prevent="close"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2
              id="articles-search-drawer-title"
              class="text-base font-semibold text-slate-900"
            >
              Search articles
            </h2>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition duration-motion-medium ease-motion-standard hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              aria-label="Close search"
              @click="close"
            >
              <Icon name="mdi:close" class="h-5 w-5" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <label
              for="article-search-drawer"
              class="mb-1 block text-xs font-medium text-slate-700"
            >
              Search by title, description, author
            </label>
            <input
              id="article-search-drawer"
              ref="searchInputRef"
              v-model="searchInput"
              type="search"
              class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Search by title, description, author..."
              autocomplete="off"
            />
          </div>
        </aside>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Index-only search drawer: slides from the right with a fading backdrop.
 * Syncs query to articlesStore; uses shared useState for open flag.
 */
const route = useRoute()
const store = useArticlesStore()
const searchOpenState = useState<boolean>('articles-search-open', () => false)

const isArticlesIndex = computed((): boolean => route.name === 'index')
const isOpen = computed((): boolean => searchOpenState.value)

const searchInputRef = ref<HTMLInputElement | null>(null)

const searchInput = ref(store.searchQuery)

watch(
  searchInput,
  (value) => {
    store.setSearchQuery(value)
  },
)

watch(
  isOpen,
  (open) => {
    if (open) {
      searchInput.value = store.searchQuery
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  },
)

function close(): void {
  searchOpenState.value = false
}

function onDocKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isOpen.value && isArticlesIndex.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onDocKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onDocKeydown)
})
</script>
