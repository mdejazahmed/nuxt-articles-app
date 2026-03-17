<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <NuxtLink :to="link_to" class="block">
      <div v-if="article.urlToImage" class="aspect-video w-full overflow-hidden bg-slate-100">
        <img
          :src="article.urlToImage"
          :alt="article.title"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div v-else class="aspect-video w-full bg-slate-200" />
      <div class="p-4">
        <h2 class="text-lg font-semibold text-slate-900 line-clamp-2">
          {{ article.title }}
        </h2>
        <p class="mt-1 text-sm text-slate-600 line-clamp-2"> 
          {{ article.description }}
        </p>
        <p class="mt-2 text-xs text-slate-500">
          {{ article.sourceName }} · {{ formatted_date }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/models/domain'
import { format_display_date } from '~/utils/format-date'

/**
 * Article list card; links to detail page.
 */
interface Props {
  article: Article
}

const props = defineProps<Props>()

const link_to = computed(() => `/articles/${props.article.id}`)
const formatted_date = computed(() => format_display_date(props.article.publishedAt))
</script>
