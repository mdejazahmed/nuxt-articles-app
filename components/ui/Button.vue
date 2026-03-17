<template>
  <button
    type="button"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
    :class="variant_classes"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * Pure UI button. Variants: primary, secondary, ghost.
 */
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' 
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

defineEmits<{
  click: []
}>()

const variant_classes = computed(() => {
  const map: Record<string, string> = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  }
  return map[props.variant] ?? map.primary
})
</script>
