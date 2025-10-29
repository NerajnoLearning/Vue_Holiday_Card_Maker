<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  textAlign?: 'left' | 'center' | 'right'
  photoSize?: 'small' | 'medium' | 'large'
  photoPosition?: 'top' | 'center' | 'bottom'
  spacing?: 'compact' | 'normal' | 'relaxed'
}

const props = withDefaults(defineProps<Props>(), {
  textAlign: 'center',
  photoSize: 'medium',
  photoPosition: 'center',
  spacing: 'normal'
})

const emit = defineEmits<{
  'update:textAlign': [value: 'left' | 'center' | 'right']
  'update:photoSize': [value: 'small' | 'medium' | 'large']
  'update:photoPosition': [value: 'top' | 'center' | 'bottom']
  'update:spacing': [value: 'compact' | 'normal' | 'relaxed']
}>()

const textAlignOptions = [
  { value: 'left' as const, label: 'Left', icon: 'M3 6h18M3 12h12M3 18h18' },
  { value: 'center' as const, label: 'Center', icon: 'M3 6h18M6 12h12M3 18h18' },
  { value: 'right' as const, label: 'Right', icon: 'M3 6h18M9 12h12M3 18h18' }
]

const photoSizeOptions = [
  { value: 'small' as const, label: 'Small', description: 'Compact photo' },
  { value: 'medium' as const, label: 'Medium', description: 'Balanced size' },
  { value: 'large' as const, label: 'Large', description: 'Full display' }
]

const photoPositionOptions = [
  { value: 'top' as const, label: 'Top', icon: 'M4 6h16M4 12h16M4 18h16' },
  { value: 'center' as const, label: 'Center', icon: 'M4 6h16M4 12h16M4 18h16' },
  { value: 'bottom' as const, label: 'Bottom', icon: 'M4 6h16M4 12h16M4 18h16' }
]

const spacingOptions = [
  { value: 'compact' as const, label: 'Compact', description: 'Minimal spacing' },
  { value: 'normal' as const, label: 'Normal', description: 'Balanced spacing' },
  { value: 'relaxed' as const, label: 'Relaxed', description: 'Generous spacing' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Text Alignment -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">Text Alignment</label>
      <div class="flex gap-2">
        <button
          v-for="option in textAlignOptions"
          :key="option.value"
          type="button"
          @click="emit('update:textAlign', option.value)"
          class="flex-1 flex flex-col items-center gap-2 px-4 py-3 border-2 rounded-lg transition-all hover:bg-gray-50"
          :class="{
            'border-blue-500 bg-blue-50 text-blue-700': textAlign === option.value,
            'border-gray-300 text-gray-700': textAlign !== option.value
          }"
          :aria-label="`Align text ${option.label.toLowerCase()}`"
          :aria-pressed="textAlign === option.value"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon" />
          </svg>
          <span class="text-xs font-medium">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Photo Size -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">Photo Size</label>
      <div class="space-y-2">
        <button
          v-for="option in photoSizeOptions"
          :key="option.value"
          type="button"
          @click="emit('update:photoSize', option.value)"
          class="w-full flex items-center justify-between px-4 py-3 border-2 rounded-lg transition-all hover:bg-gray-50"
          :class="{
            'border-blue-500 bg-blue-50 text-blue-700': photoSize === option.value,
            'border-gray-300 text-gray-700': photoSize !== option.value
          }"
          :aria-label="`Set photo size to ${option.label.toLowerCase()}`"
          :aria-pressed="photoSize === option.value"
        >
          <div class="flex items-center gap-3">
            <div
              class="rounded border-2 transition-all"
              :class="{
                'w-6 h-6': option.value === 'small',
                'w-8 h-8': option.value === 'medium',
                'w-10 h-10': option.value === 'large',
                'border-blue-500 bg-blue-100': photoSize === option.value,
                'border-gray-400 bg-gray-100': photoSize !== option.value
              }"
              aria-hidden="true"
            />
            <div class="text-left">
              <p class="text-sm font-medium">{{ option.label }}</p>
              <p class="text-xs opacity-75">{{ option.description }}</p>
            </div>
          </div>
          <svg
            v-if="photoSize === option.value"
            class="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Photo Position -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">Photo Position</label>
      <div class="flex gap-2">
        <button
          v-for="option in photoPositionOptions"
          :key="option.value"
          type="button"
          @click="emit('update:photoPosition', option.value)"
          class="flex-1 flex flex-col items-center gap-2 px-4 py-3 border-2 rounded-lg transition-all hover:bg-gray-50"
          :class="{
            'border-blue-500 bg-blue-50 text-blue-700': photoPosition === option.value,
            'border-gray-300 text-gray-700': photoPosition !== option.value
          }"
          :aria-label="`Position photo at ${option.label.toLowerCase()}`"
          :aria-pressed="photoPosition === option.value"
        >
          <div class="relative w-8 h-10 border-2 border-current rounded" aria-hidden="true">
            <div
              class="absolute left-1/2 -translate-x-1/2 w-4 h-3 bg-current rounded-sm"
              :class="{
                'top-1': option.value === 'top',
                'top-1/2 -translate-y-1/2': option.value === 'center',
                'bottom-1': option.value === 'bottom'
              }"
            />
          </div>
          <span class="text-xs font-medium">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Spacing -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">Spacing</label>
      <div class="space-y-2">
        <button
          v-for="option in spacingOptions"
          :key="option.value"
          type="button"
          @click="emit('update:spacing', option.value)"
          class="w-full flex items-center justify-between px-4 py-3 border-2 rounded-lg transition-all hover:bg-gray-50"
          :class="{
            'border-blue-500 bg-blue-50 text-blue-700': spacing === option.value,
            'border-gray-300 text-gray-700': spacing !== option.value
          }"
          :aria-label="`Set spacing to ${option.label.toLowerCase()}`"
          :aria-pressed="spacing === option.value"
        >
          <div class="flex items-center gap-3">
            <div class="flex flex-col gap-1" aria-hidden="true">
              <div
                class="w-8 h-1 rounded-full transition-all"
                :class="{
                  'bg-blue-500': spacing === option.value,
                  'bg-gray-400': spacing !== option.value
                }"
              />
              <div
                class="w-8 h-1 rounded-full transition-all"
                :class="{
                  'bg-blue-500': spacing === option.value,
                  'bg-gray-400': spacing !== option.value,
                  'mt-0': option.value === 'compact',
                  'mt-1': option.value === 'normal',
                  'mt-2': option.value === 'relaxed'
                }"
              />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium">{{ option.label }}</p>
              <p class="text-xs opacity-75">{{ option.description }}</p>
            </div>
          </div>
          <svg
            v-if="spacing === option.value"
            class="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  touch-action: manipulation;
}
</style>
