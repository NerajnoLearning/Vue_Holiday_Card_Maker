<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  fullScreen?: boolean
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  fullScreen: false,
  message: ''
})

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4'
}

const colorClasses = {
  primary: 'border-blue-600',
  secondary: 'border-gray-600',
  white: 'border-white',
  gray: 'border-gray-400'
}

const spinnerClasses = computed(() => {
  return [
    'animate-spin rounded-full border-t-transparent border-r-transparent',
    sizeClasses[props.size],
    colorClasses[props.color]
  ].join(' ')
})
</script>

<template>
  <div
    v-if="fullScreen"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <div :class="spinnerClasses"></div>
    <p v-if="message" class="mt-4 text-sm sm:text-base font-medium text-gray-700">
      {{ message }}
    </p>
    <span class="sr-only">Loading...</span>
  </div>

  <div v-else class="flex flex-col items-center justify-center" role="status" aria-live="polite">
    <div :class="spinnerClasses"></div>
    <p v-if="message" class="mt-2 text-xs sm:text-sm text-gray-600">
      {{ message }}
    </p>
    <span class="sr-only">Loading...</span>
  </div>
</template>
