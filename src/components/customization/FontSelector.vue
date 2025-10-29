<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_FONTS } from '@/types/customization'

interface Props {
  modelValue: string
  label?: string
  fonts?: typeof DEFAULT_FONTS
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Choose Font',
  fonts: () => DEFAULT_FONTS
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showDropdown = ref(false)

const selectedFont = ref(
  props.fonts.find((f) => f.value === props.modelValue) || props.fonts[0]
)

const handleFontSelect = (font: (typeof DEFAULT_FONTS)[number]) => {
  selectedFont.value = font
  emit('update:modelValue', font.value)
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.font-selector-container')) {
    showDropdown.value = false
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}
</script>

<template>
  <div class="font-selector-container relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Font Display Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <span class="text-sm font-medium text-gray-700" :style="{ fontFamily: selectedFont.value }">
        {{ selectedFont.label }}
      </span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Font Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto"
      >
        <button
          v-for="font in fonts"
          :key="font.value"
          type="button"
          @click="handleFontSelect(font)"
          class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
          :class="{
            'bg-blue-50 text-blue-700': selectedFont.value === font.value,
            'text-gray-700': selectedFont.value !== font.value
          }"
        >
          <span :style="{ fontFamily: font.value }" class="text-sm">
            {{ font.label }}
          </span>
          <svg
            v-if="selectedFont.value === font.value"
            class="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
