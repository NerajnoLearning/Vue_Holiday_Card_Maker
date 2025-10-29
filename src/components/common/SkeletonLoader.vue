<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'md',
  className: ''
})

const { prefersReducedMotion } = useReducedMotion()

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
}
</script>

<template>
  <div
    :class="[
      'bg-gray-200',
      roundedClasses[props.rounded],
      prefersReducedMotion ? '' : 'animate-pulse',
      props.className
    ]"
    :style="{
      width: props.width,
      height: props.height
    }"
    role="status"
    aria-label="Loading content"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
</style>
