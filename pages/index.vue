<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-slate-900">
      Latest articles
    </h1>
    <div
      v-if="is_search_open"
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
        ref="search_input_ref"
        v-model="search_input"
        type="search"
        class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        placeholder="Search by title, description, author..."
        autocomplete="off"
      />
    </div>
    <ul
      v-if="pending"
      :class="list_classes_grid"
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
      v-else-if="display_list.length === 0"
      title="No articles"
      :description="empty_state_description"
    />
    <ul
      v-else
      :class="is_grid_view ? list_classes_grid : list_classes_list"
    >
      <li
        v-for="article in display_list"
        :key="article.id"
      >
        <ArticleCard
          :article="article"
          :variant="is_grid_view ? 'grid' : 'list'"
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
 * Variables: store, is_search_open, search_input, display_list, is_grid_view, list_classes_grid, list_classes_list, empty_state_description.
 */
const { articles, pending, error, refresh } = useArticles()
const store = use_articles_store()

// #region variables
const search_open_state = useState<boolean>('articles-search-open', () => false)
const search_input_ref = ref<HTMLInputElement | null>(null)
const search_input = ref(store.search_query)

const list_classes_grid = computed(
  () =>
    'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
)

const list_classes_list = computed(
  () =>
    'flex flex-col gap-3',
)

const is_grid_view = computed(() => store.view_mode === 'grid')

const display_list = computed(() => store.filtered_articles)

const empty_state_description = computed(() =>
  store.search_query
    ? 'No articles match your search. Try a different keyword.'
    : 'There are no articles to show right now.',
)

const is_search_open = computed(() => search_open_state.value)
// #endregion

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.set_articles(list)
    }
  },
  { immediate: true },
)

watch(
  search_input,
  (value) => {
    store.set_search_query(value)
  },
)

watch(
  is_search_open,
  (open) => {
    if (open) {
      nextTick(() => {
        if (search_input_ref.value) {
          search_input_ref.value.focus()
        }
      })
    }
  },
  { immediate: false },
)
</script>
