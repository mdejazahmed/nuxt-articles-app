<template>
  <div
    class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
    role="alert"
    aria-live="polite"
  >
    <p class="font-medium">{{ message }}</p>
    <p v-if="detail" class="mt-1 text-sm opacity-90">{{ detail }}</p>
    <div v-if="showRetry" class="mt-3">
      <Button variant="secondary" @click="$emit('retry')"> Try again </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * User-friendly error message with optional retry.
 */
interface Props {
  message: string
  detail?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  showRetry: true,
})

defineEmits<{
  retry: []
}>()
</script>
