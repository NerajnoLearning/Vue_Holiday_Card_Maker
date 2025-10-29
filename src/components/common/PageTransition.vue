<script setup lang="ts">
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  mode?: 'in-out' | 'out-in' | 'default'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'out-in',
  duration: 300
})

const { prefersReducedMotion } = useReducedMotion()
</script>

<template>
  <Transition
    :name="prefersReducedMotion ? 'none' : 'page'"
    :mode="props.mode"
    :duration="props.duration"
  >
    <slot />
  </Transition>
</template>

<style scoped>
/* Fade + Slide animation */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* No animation for reduced motion */
.none-enter-active,
.none-leave-active {
  transition: none;
}
</style>
