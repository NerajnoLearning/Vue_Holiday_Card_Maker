<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  duration?: number
  delay?: number
  group?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 300,
  delay: 0,
  group: false
})

const { prefersReducedMotion } = useReducedMotion()
</script>

<template>
  <component
    :is="props.group ? 'TransitionGroup' : 'Transition'"
    :name="prefersReducedMotion ? 'none' : 'fade'"
    :duration="props.duration"
  >
    <slot />
  </component>
</template>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* No animation for reduced motion */
.none-enter-active,
.none-leave-active {
  transition: none;
}
</style>
