<template>
  <div class="min-h-screen bg-white text-slate-900">
    <section
      class="bg-[#233D46] text-white min-h-[45vh] pb-24"
    >
      <header class="bg-[#233D46] sticky top-0 z-50 flex h-14  items-center justify-between px-4">
        <NuxtLink
          to="/"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/40 text-white transition hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Back to articles"
        >
          <Icon name="mdi:arrow-left" class="h-6 w-6" />
        </NuxtLink>
        <div class="flex-1 text-center text-sm font-semibold text-white/95">
          Article
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="saveBookmarkButtonClasses"
            aria-label="Save for later"
            :aria-pressed="isArticleSaved"
            @click="handleToggleSave"
          >
            <Icon
              :name="isArticleSaved ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
              class="h-6 w-6"
            />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="reactionButtonClasses"
            aria-label="Toggle like/dislike"
            :aria-pressed="isArticleLiked || isArticleDisliked"
            @click="handleToggleReaction"
          >
            <Icon
              :name="reactionIconName"
              class="h-6 w-6"
            />
          </button>
        </div>
      </header>

      <div
        v-if="article"
        class="mx-auto max-w-4xl px-4 pt-6"
      >
        <h1
          class="relative z-10 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl"
        >
          {{ article.title }}
        </h1>
        <div class="mt-3 flex items-center gap-2 text-sm text-white/70">
          <Icon name="mdi:clock-outline" class="h-4 w-4" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </section>

    <div class="-mt-10 sm:-mt-16 mx-auto max-w-4xl px-4 relative z-0">
      <div
        class="overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-900/10"
      >
        <div class="aspect-video w-full overflow-hidden">
          <NuxtImg
            :src="resolvedImageSrc"
            :placeholder="PLACEHOLDER_ARTICLE_IMAGE"
            :alt="article?.title || 'Article image placeholder'"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <main class="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <Loader v-if="pending && !article" />

      <div
        v-else-if="error && !article"
        class="py-8"
      >
        <ErrorMessage :message="error" show-retry @retry="refresh()" />
      </div>

      <div
        v-else-if="!article"
        class="py-8"
      >
        <EmptyState title="Article not found" description="This article may have been removed." />
        <NuxtLink to="/" class="mt-4 inline-block text-teal-600 hover:underline">
          Back to list
        </NuxtLink>
      </div>

      <article
        v-else
        class="pt-2"
      >
        <p
          v-if="article.description"
          class="text-balance text-slate-600"
        >
          {{ article.description }}
        </p>

        <div
          v-if="article.content"
          class="mt-4 whitespace-pre-wrap text-slate-600"
        >
          {{ article.content }}
        </div>

        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-block text-teal-700 hover:underline"
        >
          Read full article
        </a>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Module: ArticleDetailPage
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Save-for-later bookmark; persist failures surface via toast (useReadingList).
 * Summary: Renders a single article detail with a top bar (back, save, like/dislike).
 * Functions:
 * - handleToggleReaction: alternates like/dislike for the current article.
 * - handleToggleSave: toggles reading list membership with optimistic persist probe.
 * Variables accessed: route, id, articles, pending, error, refresh, store, article, resolvedImageSrc, handleImageError, useReadingList.
 */
definePageMeta({ layout: false })

import type { Article } from '~/models/domain'
import { formatDisplayDate } from '~/utils/format-date'
import { useArticleImage } from '~/composables/useArticleImage'
import { PLACEHOLDER_ARTICLE_IMAGE } from '~/utils/assets'

// #region variables
const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const articleId = computed((): string => id.value)

const { articles, pending, error, refresh } = useArticles()
const store = useArticlesStore()
const { toggleSaveImmediate } = useReadingList()
// #endregion

// #region store-backed state
const isArticleSaved = computed((): boolean => store.isSaved(articleId.value))
const isArticleLiked = computed((): boolean => store.isLiked(articleId.value))
const isArticleDisliked = computed((): boolean => store.isDisliked(articleId.value))

const reactionIconName = computed((): string => {
  if (isArticleLiked.value) return 'mdi:heart-plus'
  if (isArticleDisliked.value) return 'mdi:heart-minus'
  return 'mdi:heart-plus-outline'
})

const reactionButtonClasses = computed((): string =>
  isArticleLiked.value || isArticleDisliked.value
    ? 'bg-[#195A94] text-white'
    : 'bg-slate-800/40 text-white/80 hover:bg-slate-800/70',
)

const saveBookmarkButtonClasses = computed((): string =>
  isArticleSaved.value
    ? 'bg-[#195A94] text-white'
    : 'bg-slate-800/40 text-white/80 hover:bg-slate-800/70',
)
// #endregion

// #region article resolution
// Keep store hydration in-sync with the SSR list page to avoid an extra client request.
// This matches the existing list->store wiring behavior.

watch(
  articles,
  (list) => {
    if (list.length > 0) {
      store.setArticles(list)
    }
  },
  { immediate: true }
)

const article = computed(() => {
  const fromStore = store.articleById(id.value)
  if (fromStore) return fromStore
  return articles.value.find((a: Article) => a.id === id.value) ?? null
})

const { resolvedImageSrc, handleImageError } = useArticleImage(article)

const formattedDate = computed(() =>
  article.value ? formatDisplayDate(article.value.publishedAt) : ''
)
// #endregion

// #region actions
const handleToggleReaction = (): void => {
  if (!article.value) return

  // One button "interchanges" like/dislike by alternating states:
  // neutral -> like, like -> dislike, dislike -> like.
  if (isArticleLiked.value) {
    store.toggleDislike(articleId.value)
    return
  }

  store.toggleLike(articleId.value)
}

const handleToggleSave = async (): Promise<void> => {
  if (!article.value) return
  await toggleSaveImmediate(articleId.value)
}
// #endregion
</script>
 