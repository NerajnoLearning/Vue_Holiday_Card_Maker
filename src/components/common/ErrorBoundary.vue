<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue'
import { logError } from '@/utils/error-logger'

interface Props {
  fallback?: string
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Something went wrong. Please try again.'
})

const hasError = ref(false)
const errorMessage = ref('')

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const reloadPage = () => {
  window.location.reload()
}

// Provide reset function to child components
provide('resetError', resetError)

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallback

  // Log the error
  logError(error, 'critical', {
    component: 'ErrorBoundary',
    timestamp: new Date().toISOString()
  })

  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error)
  }

  // Prevent error from propagating further
  return false
})
</script>

<template>
  <div v-if="hasError" class="min-h-[200px] flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <!-- Error Icon -->
      <div class="flex justify-center mb-4">
        <div class="rounded-full bg-red-100 p-3">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Message -->
      <h3 class="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
      <p class="text-sm text-red-700 mb-4">{{ errorMessage }}</p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          @click="resetError"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
        <button
          @click="reloadPage"
          class="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Reload Page
        </button>
      </div>

      <!-- Debug info in development -->
      <details v-if="import.meta.env.DEV" class="mt-4 text-left">
        <summary class="text-xs text-red-600 cursor-pointer hover:underline">
          Show Error Details
        </summary>
        <pre class="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{{ errorMessage }}</pre>
      </details>
    </div>
  </div>

  <slot v-else />
</template>
