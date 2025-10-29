<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  duration?: number
  group?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 300,
  group: false
})

const { prefersReducedMotion } = useReducedMotion()
</script>

<template>
  <component
    :is="props.group ? 'TransitionGroup' : 'Transition'"
    :name="prefersReducedMotion ? 'none' : 'scale'"
    :duration="props.duration"
  >
    <slot />
  </component>
</template>

<style scoped>
/* Scale animation */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* No animation for reduced motion */
.none-enter-active,
.none-leave-active {
  transition: none;
}

/* Move transition for group */
.scale-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
