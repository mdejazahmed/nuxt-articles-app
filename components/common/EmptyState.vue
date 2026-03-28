<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-8 text-center" role="status">
    <p class="text-lg font-medium text-slate-700">{{ title }}</p>
    <p v-if="description" class="mt-2 max-w-md text-balance text-slate-600">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6 w-full max-w-sm">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Empty state placeholder when there is no data to show.
 */
interface Props {
  title: string
  description?: string
} 

defineProps<Props>()
</script>
