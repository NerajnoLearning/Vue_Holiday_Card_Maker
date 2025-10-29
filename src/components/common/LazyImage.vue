<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt: string
  placeholder?: string
  width?: string | number
  height?: string | number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  objectFit: 'cover',
  loading: 'lazy'
})

const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const isError = ref(false)
const currentSrc = ref(props.placeholder)

let observer: IntersectionObserver | null = null

const loadImage = () => {
  if (isLoaded.value || isError.value) return

  const img = new Image()

  img.onload = () => {
    currentSrc.value = props.src
    isLoaded.value = true
  }

  img.onerror = () => {
    isError.value = true
  }

  img.src = props.src
}

onMounted(() => {
  if (props.loading === 'eager') {
    loadImage()
    return
  }

  // Use Intersection Observer for lazy loading
  if ('IntersectionObserver' in window && imageRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            if (observer && imageRef.value) {
              observer.unobserve(imageRef.value)
            }
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    )

    observer.observe(imageRef.value)
  } else {
    // Fallback for browsers without IntersectionObserver
    loadImage()
  }
})

onUnmounted(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value)
    observer.disconnect()
  }
})

const objectFitClass = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down'
}[props.objectFit]
</script>

<template>
  <div class="relative inline-block">
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :class="[
        objectFitClass,
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-50',
        props.className
      ]"
      :loading="props.loading"
    />

    <!-- Loading indicator -->
    <div
      v-if="!isLoaded && !isError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
    >
      <svg
        class="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <!-- Error indicator -->
    <div
      v-if="isError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-red-50"
    >
      <svg
        class="w-8 h-8 text-red-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span class="text-xs text-red-600">Failed to load</span>
    </div>
  </div>
</template>
