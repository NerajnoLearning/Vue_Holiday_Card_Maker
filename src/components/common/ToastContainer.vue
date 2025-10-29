<script setup lang="ts">
import { useToast, type Toast } from '@/composables/useToast'
import { computed } from 'vue'

const { toasts, remove } = useToast()

const getToastIcon = (type: Toast['type']) => {
  const icons = {
    success: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    `,
    error: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    `,
    warning: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    `,
    info: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    `
  }
  return icons[type]
}

const getToastClasses = (type: Toast['type']) => {
  const baseClasses = 'flex items-start gap-3 p-4 rounded-lg shadow-lg border'
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  return `${baseClasses} ${typeClasses[type]}`
}

const getIconColorClass = (type: Toast['type']) => {
  return {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }[type]
}
</script>

<template>
  <div
    class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    role="region"
    aria-label="Notifications"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClasses(toast.type)"
        class="pointer-events-auto"
      >
        <!-- Icon -->
        <div :class="getIconColorClass(toast.type)" class="flex-shrink-0" v-html="getToastIcon(toast.type)" />

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium leading-relaxed">{{ toast.message }}</p>

          <!-- Action button if provided -->
          <button
            v-if="toast.action"
            @click="toast.action.onClick"
            class="mt-2 text-sm font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            :class="{
              'text-green-700 focus:ring-green-500': toast.type === 'success',
              'text-red-700 focus:ring-red-500': toast.type === 'error',
              'text-yellow-700 focus:ring-yellow-500': toast.type === 'warning',
              'text-blue-700 focus:ring-blue-500': toast.type === 'info'
            }"
          >
            {{ toast.action.label }}
          </button>
        </div>

        <!-- Close button -->
        <button
          @click="remove(toast.id)"
          class="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 focus:outline-none focus:ring-2 transition-colors"
          :class="{
            'text-green-600 focus:ring-green-500': toast.type === 'success',
            'text-red-600 focus:ring-red-500': toast.type === 'error',
            'text-yellow-600 focus:ring-yellow-500': toast.type === 'warning',
            'text-blue-600 focus:ring-blue-500': toast.type === 'info'
          }"
          aria-label="Close notification"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Toast enter/leave transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
