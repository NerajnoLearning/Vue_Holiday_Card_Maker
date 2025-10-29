<script setup lang="ts">
import { useOnline } from '@/composables/useOnline'
import { watch } from 'vue'
import { useToast } from '@/composables/useToast'

const { isOnline, wasOffline, resetOfflineFlag } = useOnline()
const { success } = useToast()

// Show success toast when connection is restored
watch(isOnline, (online) => {
  if (online && wasOffline.value) {
    success('Connection restored! You are back online.')
    resetOfflineFlag()
  }
})
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-[60] bg-yellow-500 text-white py-3 px-4 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div class="container mx-auto flex items-center justify-center gap-3">
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm sm:text-base font-medium">
          You are currently offline. Some features may be unavailable.
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
