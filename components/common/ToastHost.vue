<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-3 max-sm:left-4 max-sm:max-w-none"
    >
      <ToastItem
        v-for="t in toasts"
        :key="t.id"
        :toast="t"
      />
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastPublic } from '~/types/toast'
import { TOAST_STATE_KEY } from '~/composables/useToast'

const toasts = useState<ToastPublic[]>(TOAST_STATE_KEY, () => [])
</script>
