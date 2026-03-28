<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-slate-900">
      Latest articles
    </h1>
    <p
      v-if="persistError"
      class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
      role="alert"
    >
      {{ persistError }}
    </p>
    <div
      v-if="isSearchOpen"
      class="mb-4"
    >
      <label
        for="article-search"
        class="mb-1 block text-xs font-medium text-slate-700"
      >
        Search articles
      </label>
      <input
        id="article-search"
        ref="searchInputRef"
        v-model="searchInput"
        type="search"
        class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        placeholder="Search by title, description, author..."
        autocomplete="off"
      />
    </div>
    <ul
      v-if="pending"
      :class="listClassesGrid"
    >
      <li
        v-for="i in 6"
        :key="i"
      >
        <SkeletonCard />
      </li>
    </ul>
    <ErrorMessage
      v-else-if="error"
      :message="error"
      show-retry
      @retry="refresh()"
    />
    <EmptyState
      v-else-if="displayList.length === 0"
      title="No articles"
      :description="emptyStateDescription"
    />
    <ul
      v-else
      :class="isGridView ? listClassesGrid : listClassesList"
    >
      <li
        v-for="article in displayList"
        :key="article.id"
      >
        <ArticleCard
          :article="article"
          :variant="isGridView ? 'grid' : 'list'"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/**
 * Module: ArticlesIndexPage
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Added header view toggle, search input, and grid/list layouts with live filtering.
 * Summary: Article list page. Fetches via useArticles, syncs to store, and renders filterable grid or list views.
 * Functions: None.
 * Variables: store, isSearchOpen, searchInput, displayList, isGridView, listClassesGrid, listClassesList, emptyStateDescription.
 */
const { articles, pending, error, refresh } = useArticles()
const store = useArticlesStore()
const { persistError } = useReadingList()

// #region variables
const searchOpenState = useState<boolean>('articles-search-open', () => false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchInput = ref(store.searchQuery)

const listClassesGrid = computed(
  () =>
    'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
)

const listClassesList = computed(
  () =>
    'flex flex-col gap-3',
)

const isGridView = computed(() => store.viewMode === 'grid')

const displayList = computed(() => store.filteredArticles)

const emptyStateDescription = computed(() =>
  store.searchQuery
    ? 'No articles match your search. Try a different keyword.'
    : 'There are no articles to show right now.',
)

const isSearchOpen = computed(() => searchOpenState.value)
// #endregion

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.setArticles(list)
    }
  },
  { immediate: true },
)

watch(
  searchInput,
  (value) => {
    store.setSearchQuery(value)
  },
)

watch(
  isSearchOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        if (searchInputRef.value) {
          searchInputRef.value.focus()
        }
      })
    }
  },
  { immediate: false },
)
</script>
