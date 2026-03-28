<template>
  <article :class="cardClasses" class="relative">
    <button
      v-if="saveButtonMode !== 'off'"
      type="button"
      class="absolute right-2 top-2 z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900/55 text-white shadow-sm ring-1 ring-white/10 transition hover:bg-slate-900/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80"
      :aria-label="bookmarkAriaLabel"
      :aria-pressed="bookmarkPressed"
      @click.stop.prevent="handleBookmarkClick"
    >
      <Icon :name="bookmarkIconName" class="h-5 w-5" />
    </button>
    <NuxtLink :to="linkTo" :class="linkClasses">
      <div :class="imageWrapperClasses">
        <NuxtImg
          :src="article.urlToImage"
          :placeholder="PLACEHOLDER_ARTICLE_IMAGE"
          :alt="article.title || 'Article image placeholder'"
          :class="imageClasses"
          loading="lazy"
          @error="handleImageError"
        />
      </div>
      <div :class="bodyClasses">
        <h2 :class="titleClasses">
          {{ article.title }}
        </h2>
        <p
          v-if="article.description && showDescription"
          :class="descriptionClasses"
        >
          {{ article.description }}
        </p>
        <div :class="metaRowClasses" class="flex align-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="metaIconWrapperClasses">
            <Icon name="mdi:clock-outline" class="h-3 w-3 text-slate-100" />
          </span>
          <span class="truncate">
            {{ formattedDate }}
          </span>
          </div>
          <div
          v-if="showCta"
          class="flex justify-end"
        >
          <span
            class="inline-flex items-center gap-2 rounded-full bg-[#195A94] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
          >
            Read More
            <Icon name="mdi:arrow-right" class="h-4 w-4 text-white" />
          </span>
        </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/models/domain'
import { formatDisplayDate } from '~/utils/format-date'
import { useArticleImage } from '~/composables/useArticleImage'
import { PLACEHOLDER_ARTICLE_IMAGE } from '~/utils/assets'

/**
 * Module: ArticleCard
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Added save-for-later bookmark (toggle / reading-list modes) with click.stop so list navigation is unchanged.
 * Summary: Displays a single article preview card with image, title, description, date, optional Read More CTA, and bookmark control.
 * Functions: handleBookmarkClick.
 * Variables accessed: article (prop), linkTo, formattedDate, linkClasses, saveButtonMode, store, useReadingList.
 */
interface Props {
  article: Article
  variant?: 'grid' | 'list'
  /** toggle: list/detail immediate save; readingList: /saved undo flow; off: hide */
  saveButtonMode?: 'toggle' | 'off' | 'readingList'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'grid',
  saveButtonMode: 'toggle',
})

// #region derived values
const linkTo = computed((): string => `/articles/${props.article.id}`)
const formattedDate = computed((): string => formatDisplayDate(props.article.publishedAt))
const { resolvedImageSrc, handleImageError } = useArticleImage(props.article)

const isListVariant = computed((): boolean => props.variant === 'list')

const cardClasses = computed(
  () =>
    'overflow-hidden rounded-2xl bg-[#233D46] text-white shadow-md ring-1 ring-slate-900/40 transition hover:shadow-lg',
)

const linkClasses = computed(
  (): string =>
    isListVariant.value
      ? 'flex flex-row items-start gap-3'
      : 'flex flex-col',
)

const imageWrapperClasses = computed(
  () =>
    isListVariant.value
      ? 'w-28 sm:w-36 flex-shrink-0 overflow-hidden bg-slate-800'
      : 'aspect-video w-full overflow-hidden bg-slate-800',
)

const bodyClasses = computed(
  () =>
    isListVariant.value
      ? 'flex flex-1 flex-col p-3 min-w-0'
      : 'flex flex-1 flex-col p-4',
)

const titleClasses = computed(
  () =>
    isListVariant.value
      ? 'text-sm font-semibold leading-snug text-white line-clamp-2'
      : 'text-base font-semibold leading-snug text-white line-clamp-2',
)

const descriptionClasses = computed(
  () =>
    isListVariant.value
      ? 'mt-1 text-xs text-slate-100/80 line-clamp-2'
      : 'mt-2 text-sm text-slate-100/80 line-clamp-2',
)

const metaRowClasses = computed(
  () =>
    isListVariant.value
      ? 'mt-auto flex items-center text-[11px] text-slate-100/70'
      : 'mt-3 flex items-center text-xs text-slate-100/70',
)

const metaIconWrapperClasses = computed(
  () =>
    'mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/40',
)

const imageClasses = computed(
  (): string =>
    isListVariant.value ? 'w-full object-cover' : 'h-full w-full object-cover',
)

const showDescription = computed((): boolean => true)

const showCta = computed((): boolean => !isListVariant.value)

const store = useArticlesStore()
const {
  toggleSaveImmediate,
  requestUnsaveOnReadingList,
} = useReadingList()

const isSavedArticle = computed((): boolean => store.isSaved(props.article.id))
const isScheduledRemoval = computed((): boolean =>
  store.isScheduledForRemoval(props.article.id),
)

const bookmarkIconName = computed((): string => {
  if (props.saveButtonMode === 'readingList' && isScheduledRemoval.value) {
    return 'mdi:bookmark-remove'
  }

  return isSavedArticle.value ? 'mdi:bookmark' : 'mdi:bookmark-outline'
})

const bookmarkPressed = computed((): boolean => isSavedArticle.value)

const bookmarkAriaLabel = computed((): string => {
  if (props.saveButtonMode === 'readingList') {
    if (isScheduledRemoval.value) {
      return 'Pending removal from reading list'
    }

    return 'Remove from reading list'
  }

  return isSavedArticle.value ? 'Remove from reading list' : 'Save for later'
})

async function handleBookmarkClick(): Promise<void> {
  if (props.saveButtonMode === 'off') {
    return
  }

  if (props.saveButtonMode === 'readingList') {
    if (isScheduledRemoval.value) {
      return
    }

    requestUnsaveOnReadingList(props.article.id)
    return
  }

  await toggleSaveImmediate(props.article.id)
}

// #endregion
</script>
