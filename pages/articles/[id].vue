<template>
  <div class="min-h-screen bg-white text-slate-900">
    <section
      class="bg-[#233D46] text-white min-h-[45vh] pb-24"
    >
      <div class="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
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
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="reaction_button_classes"
            aria-label="Toggle like/dislike"
            :aria-pressed="is_article_liked || is_article_disliked"
            @click="handle_toggle_reaction"
          >
            <Icon
              :name="reaction_icon_name"
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>

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
          <span>{{ formatted_date }}</span>
        </div>
      </div>
    </section>

    <div class="-mt-10 sm:-mt-16 mx-auto max-w-4xl px-4 relative z-0">
      <div
        class="overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-900/10"
      >
        <div class="aspect-video w-full overflow-hidden">
          <NuxtImg
            :src="resolved_image_src"
            :alt="article?.title || 'Article image placeholder'"
            class="h-full w-full object-cover"
            @error="handle_image_error"
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
 * Modification History: Updated detail layout to match dark article design with back and like/dislike actions.
 * Summary: Renders a single article detail with a top bar (back arrow, like, dislike).
 * Functions:
 * - handle_toggle_reaction: alternates like/dislike for the current article.
 * Variables accessed: route, id, articles, pending, error, refresh, store, article, resolved_image_src, handle_image_error.
 */
definePageMeta({ layout: false })

import { format_display_date } from '~/utils/format-date'
import { use_article_image } from '~/composables/use_article_image'

// #region variables
const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const article_id = computed((): string => id.value)

const { articles, pending, error, refresh } = useArticles()
const store = use_articles_store()
// #endregion

// #region store-backed state
const is_article_liked = computed((): boolean => store.is_liked(article_id.value))
const is_article_disliked = computed((): boolean => store.is_disliked(article_id.value))

const reaction_icon_name = computed((): string => {
  if (is_article_liked.value) return 'mdi:heart-plus'
  if (is_article_disliked.value) return 'mdi:heart-minus'
  return 'mdi:heart-plus-outline'
})

const reaction_button_classes = computed((): string =>
  is_article_liked.value || is_article_disliked.value
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
// #endregion

// #region actions
const handle_toggle_reaction = (): void => {
  if (!article.value) return

  // One button "interchanges" like/dislike by alternating states:
  // neutral -> like, like -> dislike, dislike -> like.
  if (is_article_liked.value) {
    store.toggle_dislike(article_id.value)
    return
  }

  store.toggle_like(article_id.value)
}
// #endregion
</script>
 