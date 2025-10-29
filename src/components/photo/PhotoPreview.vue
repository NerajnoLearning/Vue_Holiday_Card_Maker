<template>
  <div class="relative w-full">
    <img :src="src" :alt="alt" class="w-full h-48 object-cover rounded-lg" />

    <button
      type="button"
      @click="emitRemove"
      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
      aria-label="Remove photo"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div v-if="loading" class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
      <div class="text-white text-sm">Processing...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ src: string; alt?: string; loading?: boolean }>()
// typed emits
const emit = defineEmits<{ (e: 'remove'): void }>()
const emitRemove = () => emit('remove')

const { src, alt = 'Preview', loading = false } = props
</script>
