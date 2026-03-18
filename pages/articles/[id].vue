<template>
  <div>
    <Loader v-if="pending && !article" />
    <div v-else-if="error && !article" class="py-8">
      <ErrorMessage :message="error" show-retry @retry="refresh()" />
    </div>
    <div v-else-if="!article" class="py-8">
      <EmptyState title="Article not found" description="This article may have been removed." />
      <NuxtLink to="/" class="mt-4 inline-block text-teal-600 hover:underline">Back to list</NuxtLink>
    </div>
    <article v-else class="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="aspect-video w-full overflow-hidden rounded-t-lg bg-slate-100">
        <NuxtImg
          :src="resolved_image_src"
          :alt="article.title || 'Article image placeholder'"
          class="h-full w-full object-cover"
          @error="handle_image_error"
        />
      </div>
      <div class="p-6">
        <h1 class="text-2xl font-bold text-slate-900">{{ article.title }}</h1>
        <p class="mt-2 text-sm text-slate-500">
          {{ article.sourceName }} · {{ article.author }} · {{ formatted_date }}
        </p>
        <p v-if="article.description" class="mt-4 text-slate-700">
          {{ article.description }}
        </p>
        <div v-if="article.content" class="mt-4 whitespace-pre-wrap text-slate-700">
          {{ article.content }}
        </div>
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-block text-teal-600 hover:underline"
        >
          Read full article
        </a>
        <div class="mt-6">
          <NuxtLink to="/" class="text-teal-600 hover:underline">← Back to list</NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { format_display_date } from '~/utils/format-date'
import { use_article_image } from '~/composables/use_article_image'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const { articles, pending, error, refresh } = useArticles()
const store = use_articles_store()

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.set_articles(list)
    }
  },
  { immediate: true }
)

const article = computed(() => {
  const from_store = store.article_by_id(id.value)
  if (from_store) return from_store
  return articles.value.find((a) => a.id === id.value) ?? null
})

const { resolved_image_src, handle_image_error } = use_article_image(article)

const formatted_date = computed(() =>
  article.value ? format_display_date(article.value.publishedAt) : ''
)
</script>
 