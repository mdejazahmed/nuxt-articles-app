<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-slate-900">
      Latest articles
    </h1>
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
    <TransitionGroup
      v-else
      tag="ul"
      name="article-list"
      class="article-list-root"
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
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
/**
 * Module: ArticlesIndexPage
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Search moved to ArticlesSearchDrawer; list uses TransitionGroup for filter motion.
 * Summary: Article list page. Fetches via useArticles, syncs to store, and renders filterable grid or list views.
 * Functions: None.
 * Variables: store, displayList, isGridView, listClassesGrid, listClassesList, emptyStateDescription.
 */
const { articles, pending, error, refresh } = useArticles()
const store = useArticlesStore()

// #region variables
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
</script>
