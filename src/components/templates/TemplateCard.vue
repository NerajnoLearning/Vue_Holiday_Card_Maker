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
    class="relative overflow-hidden rounded-lg border-4 transition-all duration-200 hover:scale-105"
    :class="selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'"
  >
    <img
      :src="template.thumbnail"
      :alt="template.name"
      class="w-full h-32 object-cover"
    />
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
      <p class="text-white text-sm font-semibold text-center">
        {{ template.name }}
      </p>
    </div>
    <div
      v-if="selected"
      class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </button>
</template>
