<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
    <h1 class="text-2xl font-bold text-slate-900">Something went wrong</h1>
    <p class="mt-2 text-slate-600">{{ error?.message ?? 'An unexpected error occurred.' }}</p>
    <Button class="mt-6" @click="clear_error">Go home</Button>
  </div>
</template>

<script setup lang="ts">
/**
 * Global error boundary: shown when a fatal error occurs.
 */
const error = useError()

function clear_error(): void {
  clearError({ redirect: '/' })
}
</script>
 