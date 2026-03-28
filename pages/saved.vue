<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-slate-900">
      Saved for later
    </h1>
    <p class="mb-6 text-sm text-slate-600">
      Articles you bookmarked from the list or detail page. Unsave here with a short undo window.
    </p>

    <p
      v-if="persistError"
      class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
      role="alert"
    >
      {{ persistError }}
    </p>

    <ul
      v-if="pending"
      :class="isGridView ? listClassesGrid : listClassesList"
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
      v-else-if="store.savedArticleIds.length === 0"
      title="Your reading list is empty"
      description="Save articles from the feed or an article page — they will show up here for quick access."
    >
      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        Browse articles
      </NuxtLink>
    </EmptyState>
    <ul
      v-else
      :class="isGridView ? listClassesGrid : listClassesList"
    >
      <li
        v-for="article in store.savedArticlesOrdered"
        :key="article.id"
        class="flex flex-col gap-2"
      >
        <ArticleCard
          :article="article"
          :variant="isGridView ? 'grid' : 'list'"
          save-button-mode="readingList"
        />
        <div
          v-if="store.isScheduledForRemoval(article.id)"
          class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
        >
          <span>Removing from your list…</span>
          <button
            type="button"
            class="rounded font-semibold text-teal-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            @click="cancelUnsaveOnReadingList(article.id)"
          >
            Undo
          </button>
        </div>
      </li>
      <li
        v-for="orphanId in orphanSavedIds"
        :key="'orphan-' + orphanId"
        :class="isGridView ? 'col-span-full' : ''"
        class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
      >
        <span>A saved article is not in the current feed.</span>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          @click="removeOrphan(orphanId)"
        >
          Remove from saved
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/**
 * Module: SavedReadingListPage
 * Summary: Reading list with scheduled unsave + undo, hydrates articles via useArticles.
 */
const { articles, pending, error, refresh } = useArticles()
const store = useArticlesStore()
const {
  persistError,
  toggleSaveImmediate,
  cancelUnsaveOnReadingList,
} = useReadingList()

const listClassesGrid = computed(
  () =>
    'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
)

const listClassesList = computed(
  () =>
    'flex flex-col gap-3',
)

const isGridView = computed(() => store.viewMode === 'grid')

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.setArticles(list)
    }
  },
  { immediate: true },
)

const orphanSavedIds = computed((): string[] => {
  const known = new Set(store.articles.map((a) => a.id))
  return store.savedArticleIds.filter((id) => !known.has(id))
})

async function removeOrphan(articleId: string): Promise<void> {
  if (store.isSaved(articleId)) {
    await toggleSaveImmediate(articleId)
  }
}
</script>
