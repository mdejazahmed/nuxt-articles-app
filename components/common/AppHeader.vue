<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900">
    <div class="flex h-14 items-center justify-between px-4">
      <NuxtLink
        to="/"
        class="text-lg font-semibold tracking-tight hover:opacity-90"
      >
        Articles
      </NuxtLink>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/saved"
          class="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-900 hover:bg-slate-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
          aria-label="Saved articles"
        >
          <Icon name="mdi:bookmark-outline" class="h-5 w-5" />
          <span
            v-if="savedCount > 0"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white"
          >
            {{ savedCount > 99 ? '99+' : savedCount }}
          </span>
        </NuxtLink>
        <button
          v-if="showViewToggle"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-900 hover:bg-slate-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
          :aria-label="viewToggleAriaLabel"
          @click="handleToggleViewMode"
        >
          <Icon
            v-if="isGridView"
            name="mdi:view-grid-outline"
            class="h-5 w-5"
          />
          <Icon
            v-else
            name="mdi:format-list-bulleted"
            class="h-5 w-5"
          />
        </button>
        <button
          v-if="showSearchToggle"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-900 hover:bg-slate-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
          aria-label="Search articles"
          @click="$emit('toggle-search')"
        >
          <Icon
            name="mdi:magnify"
            class="h-5 w-5"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Module: AppHeader
 * Creator: user
 * Creation Date: 2026-03-18
 * Modification History: Updated layout to match mobile articles design with action icons.
 * Summary: Top bar with home title, saved reading list link, and index-only view/search toggles.
 * Functions: None.
 * Variables: None.
 */
interface Props {
  showViewToggle?: boolean
  showSearchToggle?: boolean
  viewMode?: 'grid' | 'list'
  savedCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showViewToggle: false,
  showSearchToggle: false,
  viewMode: 'grid',
  savedCount: 0,
})

const emit = defineEmits<{
  (event: 'toggle-view'): void
  (event: 'toggle-search'): void
}>()

const isGridView = computed((): boolean => props.viewMode === 'grid')

const viewToggleAriaLabel = computed((): string =>
  isGridView.value ? 'Switch to list view' : 'Switch to grid view',
)

const handleToggleViewMode = (): void =>
{
  emit('toggle-view')
}
</script>
