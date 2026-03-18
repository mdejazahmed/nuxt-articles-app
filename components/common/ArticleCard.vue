<template>
  <article :class="card_classes">
    <NuxtLink :to="link_to" class="flex h-full flex-col">
      <div :class="image_wrapper_classes">
        <NuxtImg
          :src="resolved_image_src"
          :alt="article.title || 'Article image placeholder'"
          class="h-full w-full object-cover"
          loading="lazy"
          @error="handle_image_error"
        />
      </div>
      <div :class="body_classes">
        <h2 :class="title_classes">
          {{ article.title }}
        </h2>
        <p
          v-if="article.description && show_description"
          :class="description_classes"
        >
          {{ article.description }}
        </p>
        <div :class="meta_row_classes">
          <span :class="meta_icon_wrapper_classes">
            <Icon name="mdi:clock-outline" class="h-3 w-3 text-slate-100" />
          </span>
          <span class="truncate">
            {{ formatted_date }}
          </span>
        </div>
        <div
          v-if="show_cta"
          class="mt-4 flex justify-end"
        >
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
  variant?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'grid',
})

const link_to = computed((): string => `/articles/${props.article.id}`)
const formatted_date = computed((): string => format_display_date(props.article.publishedAt))
const { resolved_image_src, handle_image_error } = use_article_image(props.article)

const is_list_variant = computed((): boolean => props.variant === 'list')

const card_classes = computed(
  () =>
    'overflow-hidden rounded-2xl bg-[#233D46] text-white shadow-md ring-1 ring-slate-900/40 transition hover:shadow-lg',
)

const image_wrapper_classes = computed(
  () =>
    is_list_variant.value
      ? 'aspect-[4/3] w-full overflow-hidden bg-slate-800'
      : 'aspect-video w-full overflow-hidden bg-slate-800',
)

const body_classes = computed(
  () =>
    is_list_variant.value
      ? 'flex flex-1 flex-col p-3'
      : 'flex flex-1 flex-col p-4',
)

const title_classes = computed(
  () =>
    is_list_variant.value
      ? 'text-sm font-semibold leading-snug text-white line-clamp-2'
      : 'text-base font-semibold leading-snug text-white line-clamp-2',
)

const description_classes = computed(
  () =>
    is_list_variant.value
      ? 'mt-1 text-xs text-slate-100/80 line-clamp-2'
      : 'mt-2 text-sm text-slate-100/80 line-clamp-2',
)

const meta_row_classes = computed(
  () =>
    is_list_variant.value
      ? 'mt-2 flex items-center text-[11px] text-slate-100/70'
      : 'mt-3 flex items-center text-xs text-slate-100/70',
)

const meta_icon_wrapper_classes = computed(
  () =>
    'mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/40',
)

const show_description = computed((): boolean => true)

const show_cta = computed((): boolean => !is_list_variant.value)
</script>
