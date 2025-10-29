<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  distance?: number
  group?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'up',
  duration: 300,
  distance: 20,
  group: false
})

const { prefersReducedMotion } = useReducedMotion()

const transitionName = prefersReducedMotion.value ? 'none' : `slide-${props.direction}`
</script>

<template>
  <component
    :is="props.group ? 'TransitionGroup' : 'Transition'"
    :name="transitionName"
    :duration="props.duration"
  >
    <slot />
  </component>
</template>

<style scoped>
/* Slide Up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Slide Down */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Slide Left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide Right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* No animation for reduced motion */
.none-enter-active,
.none-leave-active {
  transition: none;
}

/* Move transition for group */
.slide-up-move,
.slide-down-move,
.slide-left-move,
.slide-right-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
