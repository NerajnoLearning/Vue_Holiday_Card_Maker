<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDarkMode } = useDarkMode()

const ariaLabel = computed(() =>
  isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
)
</script>

<template>
  <button
    @click="toggleDarkMode"
    :aria-label="ariaLabel"
    class="
      relative inline-flex items-center justify-center
      p-2 rounded-lg
      transition-all duration-200
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
      text-gray-700 dark:text-gray-200
    "
    title="Toggle dark mode"
  >
    <!-- Sun Icon (Light Mode) -->
    <Transition name="icon-fade" mode="out-in">
      <svg
        v-if="!isDark"
        key="sun"
        class="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        ></path>
      </svg>

      <!-- Moon Icon (Dark Mode) -->
      <svg
        v-else
        key="moon"
        class="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        ></path>
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

@media (prefers-reduced-motion: reduce) {
  .icon-fade-enter-active,
  .icon-fade-leave-active {
    transition: none;
  }

  .icon-fade-enter-from,
  .icon-fade-leave-to {
    transform: none;
  }
}
</style>
