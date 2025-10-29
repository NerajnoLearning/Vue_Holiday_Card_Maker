<script setup lang="ts">
import type { HolidayTemplate } from '@/types/template'

interface Props {
  template: HolidayTemplate
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})
</script>

<template>
  <button
    type="button"
    class="relative overflow-hidden rounded-lg border-4 touch-manipulation transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95"
    :class="selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'"
  >
    <img
      :src="template.thumbnail"
      :alt="template.name"
      class="w-full h-32 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
    />
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 transition-opacity duration-200">
      <p class="text-white text-sm font-semibold text-center">
        {{ template.name }}
      </p>
    </div>
    <Transition name="scale">
      <div
        v-if="selected"
        class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </Transition>
  </button>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (prefers-reduced-motion: reduce) {
  .scale-enter-active,
  .scale-leave-active {
    transition: none;
  }

  img {
    transition: none !important;
  }

  button {
    transition: none !important;
  }
}
</style>
