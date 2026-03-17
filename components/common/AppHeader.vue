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
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/60 text-white hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label="Search articles"
        >
          <span class="block h-4 w-4 rounded-full border-2 border-current" />
        </button>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/60 text-white hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label="Open favorites"
        >
          <span class="relative block h-4 w-4 border-2 border-current">
            <span class="absolute inset-0 m-[1px] bg-current" />
          </span>
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
</script>
