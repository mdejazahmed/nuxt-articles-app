<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-slate-900">Latest articles</h1>
    <ul v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="i in 6" :key="i">
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
      description="There are no articles to show right now."
    />
    <ul v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="article in display_list" :key="article.id">
        <ArticleCard :article="article" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/**
 * Article list page. Fetches via useArticles, syncs to store, shows loading/error/empty/list.
 */
const { articles, pending, error, refresh } = useArticles()
const store = use_articles_store()

const display_list = computed(() => articles.value)

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.set_articles(list)
    }
  },
  { immediate: true }
)
</script>
