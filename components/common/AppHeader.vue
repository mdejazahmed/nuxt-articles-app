<template>
  <header class="border-b border-slate-800 bg-[#233D46] text-white">
    <div class="mx-auto flex h-14 max-w-md items-center justify-between px-4">
      <NuxtLink
        to="/"
        class="text-lg font-semibold tracking-tight hover:opacity-90"
      >
        Articles
      </NuxtLink>
      <div class="flex items-center gap-3">
        <button
          v-if="show_view_toggle"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/60 text-white hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          :aria-label="view_toggle_aria_label"
          @click="handle_toggle_view_mode"
        >
          <Icon
            v-if="is_grid_view"
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
          v-if="show_search_toggle"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/60 text-white hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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
 * Summary: Provides the top application bar with title and action icons for search and favorites.
 * Functions: None.
 * Variables: None.
 */
interface Props {
  show_view_toggle?: boolean
  show_search_toggle?: boolean
  view_mode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  show_view_toggle: false,
  show_search_toggle: false,
  view_mode: 'grid',
})

const emit = defineEmits<{
  (event: 'toggle-view'): void
  (event: 'toggle-search'): void
}>()

const is_grid_view = computed((): boolean => props.view_mode === 'grid')

const view_toggle_aria_label = computed((): string =>
  is_grid_view.value ? 'Switch to list view' : 'Switch to grid view',
)

const handle_toggle_view_mode = (): void =>
{
  emit('toggle-view')
}
</script>
