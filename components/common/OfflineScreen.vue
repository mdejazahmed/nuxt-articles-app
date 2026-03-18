<template>
  <section
    class="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center bg-[#DAD9D9] px-4 py-10 text-center"
    role="status"
    aria-live="polite"
  >
    <div class="flex w-full max-w-sm flex-col items-center">
      <div class="flex h-24 w-24 items-center justify-center text-slate-700">
        <svg
          viewBox="0 0 64 64"
          class="h-20 w-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 22c8-8 20-8 28 0"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M14 30c5-5 13-5 18 0"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M22 38c2-2 6-2 8 0"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M10 10l44 44"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
          <circle cx="32" cy="48" r="3" fill="currentColor" />
        </svg>
      </div>

      <h2 class="mt-2 text-xl font-semibold text-slate-900">You’re offline</h2>
      <p class="mt-2 text-sm text-slate-600">
        Please connect to the internet and try again.
      </p>

      <div class="mt-6">
        <Button variant="secondary" @click="$emit('retry')">Retry</Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Module: OfflineScreen
 * Creator: assistant
 * Creation Date: 2026-03-18
 * Modification History:
 * - 2026-03-18: initial version.
 * Summary:
 * - Full-page offline placeholder with a Retry action.
 * Functions:
 * - Emits: retry
 * Variables accessed:
 * - None
 */

defineEmits<{
  retry: []
}>()
</script>

<style scoped></style>

