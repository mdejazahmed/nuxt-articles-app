<template>
  <div
    :class="surfaceClass"
    class="pointer-events-auto relative overflow-hidden rounded-lg border shadow-lg"
    :role="a11yRole"
    :aria-live="a11yLive"
    aria-atomic="true"
    @mouseenter="paused = true"
    @mouseleave="onPointerLeave"
  >
    <div class="flex items-start gap-3 px-4 py-3">
      <p class="min-w-0 flex-1 text-sm text-slate-800 text-balance">
        {{ toast.message }}
      </p>
      <div class="flex shrink-0 items-center gap-2">
        <button
          v-if="toast.actionLabel"
          type="button"
          class="rounded-md px-2 py-1 text-sm font-medium text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
          @click="handleAction"
        >
          {{ toast.actionLabel }}
        </button>
        <button
          type="button"
          class="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
          aria-label="Dismiss"
          @click="handleDismiss"
        >
          <span aria-hidden="true" class="block text-lg leading-none">&times;</span>
        </button>
      </div>
    </div>
    <div class="h-1 w-full bg-slate-200">
      <div
        class="h-full rounded-none"
        :class="progressClass"
        :style="progressStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToastPublic } from '~/types/toast'
import { removeToast, runToastAction } from '~/composables/useToast'

const DURATION_MS = 4000

const props = defineProps<{
  toast: ToastPublic
}>()

const remainingMs = ref(DURATION_MS)
const paused = ref(false)
const skipNextDelta = ref(false)

let lastTs = 0
let rafId: number | null = null

const progressRatio = computed(() => remainingMs.value / DURATION_MS)

const progressStyle = computed(() => ({
  width: '100%',
  transformOrigin: 'left center',
  transform: `scaleX(${progressRatio.value})`,
}))

const a11yRole = computed((): 'alert' | 'status' =>
  props.toast.variant === 'error' ? 'alert' : 'status',
)

const a11yLive = computed((): 'assertive' | 'polite' =>
  props.toast.variant === 'error' ? 'assertive' : 'polite',
)

const surfaceClass = computed(() => {
  const base = 'bg-white'
  if (props.toast.variant === 'error') {
    return `${base} border-rose-300`
  }
  if (props.toast.variant === 'success') {
    return `${base} border-teal-300`
  }
  return `${base} border-slate-200`
})

const progressClass = computed(() => {
  if (props.toast.variant === 'error') {
    return 'bg-rose-500'
  }
  if (props.toast.variant === 'success') {
    return 'bg-teal-600'
  }
  return 'bg-sky-600'
})

function onPointerLeave(): void {
  skipNextDelta.value = true
  paused.value = false
}

function handleDismiss(): void {
  removeToast(props.toast.id)
}

function handleAction(): void {
  runToastAction(props.toast.id)
}

function loop(ts: number): void {
  if (paused.value) {
    rafId = requestAnimationFrame(loop)
    return
  }
  if (skipNextDelta.value) {
    skipNextDelta.value = false
    lastTs = ts
    rafId = requestAnimationFrame(loop)
    return
  }
  if (lastTs === 0) {
    lastTs = ts
  } else {
    remainingMs.value = Math.max(0, remainingMs.value - (ts - lastTs))
    lastTs = ts
  }
  if (remainingMs.value <= 0) {
    removeToast(props.toast.id)
    return
  }
  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
})
</script>
