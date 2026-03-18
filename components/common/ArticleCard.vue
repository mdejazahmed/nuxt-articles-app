<template>
  <article
    class="overflow-hidden rounded-2xl bg-[#233D46] text-white shadow-md ring-1 ring-slate-900/40 transition hover:shadow-lg"
  >
    <NuxtLink :to="link_to" class="flex h-full flex-col">
      <div class="aspect-video w-full overflow-hidden bg-slate-800">
        <NuxtImg
          :src="resolved_image_src"
          :alt="article.title || 'Article image placeholder'"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div class="flex flex-1 flex-col p-4">
        <h2 class="text-base font-semibold leading-snug text-white line-clamp-2">
          {{ article.title }}
        </h2>
        <p
          v-if="article.description"
          class="mt-2 text-sm text-slate-100/80 line-clamp-2"
        >
          {{ article.description }}
        </p>
        <div class="mt-3 flex items-center text-xs text-slate-100/70">
          <span class="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/40">
            <Icon name="mdi:clock-outline" class="h-3 w-3 text-slate-100" />
          </span>
          <span class="truncate">
            {{ formatted_date }}
          </span>
        </div>
        <div class="mt-4 flex justify-end">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-[#195A94] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
          >
            Read More
            <Icon name="mdi:arrow-right" class="h-4 w-4 text-white" />
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/models/domain'
import { format_display_date } from '~/utils/format-date'
import { use_article_image } from '~/composables/use_article_image'

/**
 * Module: ArticleCard
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Updated visual design to match mobile article card reference.
 * Summary: Displays a single article preview card with image, title, description, date, and a styled Read More call-to-action.
 * Functions: None.
 * Variables: article (prop), link_to, formatted_date.
 */
interface Props {
  article: Article
}

const props = defineProps<Props>()

const link_to = computed((): string => `/articles/${props.article.id}`)
const formatted_date = computed((): string => format_display_date(props.article.publishedAt))
const { resolved_image_src } = use_article_image(props.article)
</script>
