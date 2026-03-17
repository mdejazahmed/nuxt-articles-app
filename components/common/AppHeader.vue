<template>
  <header class="border-b border-slate-200 bg-slate-900 text-white">
    <div class="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight hover:opacity-90">
        Articles
      </NuxtLink>
      <nav aria-label="Main">
        <NuxtLink
          to="/"
          class="rounded px-3 py-2 text-sm font-medium hover:bg-slate-800"
          active-class="bg-slate-800"
        >
          Home
        </NuxtLink>
      </nav>
    </div> 
  </header>
</template>

<script setup lang="ts">
/**
 * App header with logo and main nav.
 */
</script>
