<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  remove: []
}>()

const emitRemove = () => emit('remove')
</script>

<template>
  <div class="relative w-full">
    <!-- Image -->
    <img
      :src="props.src"
      :alt="props.alt || 'Photo preview'"
      class="w-full h-48 object-cover rounded-lg"
      :class="{ 'opacity-50': props.loading }"
    />

    <!-- Remove button -->
    <button
      v-if="!props.loading"
      type="button"
      @click="emitRemove"
      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

    <!-- Loading overlay -->
    <div
      v-if="props.loading"
      class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-lg"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-2"></div>
      <div class="text-white text-sm font-medium">Processing...</div>
    </div>
  </div>
</template>
