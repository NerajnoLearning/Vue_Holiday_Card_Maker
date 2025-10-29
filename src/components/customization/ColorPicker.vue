<script setup lang="ts">
import { ref, computed } from 'vue'
import { DEFAULT_COLORS } from '@/types/customization'

interface Props {
  modelValue: string
  label?: string
  presets?: typeof DEFAULT_COLORS
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Choose Color',
  presets: () => DEFAULT_COLORS
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPicker = ref(false)
const customColor = ref(props.modelValue)

const handlePresetSelect = (color: string) => {
  emit('update:modelValue', color)
  showPicker.value = false
}

const handleCustomColorChange = () => {
  emit('update:modelValue', customColor.value)
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.color-picker-container')) {
    showPicker.value = false
  }
}

// Add click outside listener when picker is shown
const togglePicker = () => {
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}
</script>

<template>
  <div class="color-picker-container relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Color Display Button -->
    <button
      type="button"
      @click="togglePicker"
      class="flex items-center gap-3 w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <div
        class="w-8 h-8 rounded-md border-2 border-gray-300 flex-shrink-0"
        :style="{ backgroundColor: modelValue }"
      />
      <span class="text-sm font-medium text-gray-700 uppercase">{{ modelValue }}</span>
      <svg class="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Color Picker Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="showPicker"
        class="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      >
        <!-- Preset Colors -->
        <div class="mb-4">
          <p class="text-xs font-medium text-gray-600 mb-2">Preset Colors</p>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="preset in presets"
              :key="preset.value"
              type="button"
              @click="handlePresetSelect(preset.value)"
              class="group relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
              :class="{
                'border-blue-500 ring-2 ring-blue-200': modelValue === preset.value,
                'border-gray-300': modelValue !== preset.value
              }"
              :style="{ backgroundColor: preset.value }"
              :title="preset.label"
            >
              <svg
                v-if="modelValue === preset.value"
                class="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg"
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
        </div>

        <!-- Custom Color Input -->
        <div>
          <p class="text-xs font-medium text-gray-600 mb-2">Custom Color</p>
          <div class="flex items-center gap-2">
            <input
              v-model="customColor"
              type="color"
              @input="handleCustomColorChange"
              class="w-12 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              v-model="customColor"
              type="text"
              @input="handleCustomColorChange"
              placeholder="#000000"
              maxlength="7"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
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
