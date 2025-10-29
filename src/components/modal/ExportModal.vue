<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import GreetingCard from '@/components/card/GreetingCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useExport, type ExportFormat } from '@/composables/useExport'

interface Props {
  template: string
  name: string
  greeting: string
  photo?: File | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { isExporting, error, progress, exportAsPDF, exportAsJPG } = useExport()

const selectedFormat = ref<ExportFormat>('pdf')
const cardElement = ref<HTMLElement | null>(null)
const filename = ref('greeting-card')

const formatOptions: { value: ExportFormat; label: string; icon: string }[] = [
  { value: 'pdf', label: 'PDF Document', icon: '📄' },
  { value: 'jpg', label: 'JPG Image', icon: '🖼️' }
]

const fullFilename = computed(() => {
  return `${filename.value}.${selectedFormat.value}`
})

const handleClose = () => {
  if (!isExporting.value) {
    emit('close')
  }
}

const handleExport = async () => {
  // Get the card element from the ref
  const element = cardElement.value?.querySelector('.greeting-card') as HTMLElement

  if (!element) {
    console.error('Card element not found')
    return
  }

  const options = {
    filename: fullFilename.value,
    quality: selectedFormat.value === 'pdf' ? 0.95 : 0.92
  }

  let success = false

  if (selectedFormat.value === 'pdf') {
    success = await exportAsPDF(element, options)
  } else {
    success = await exportAsJPG(element, options)
  }

  // Close modal after successful export (with delay)
  if (success) {
    setTimeout(() => {
      emit('close')
    }, 1500)
  }
}
</script>

<template>
  <BaseModal :model-value="true" max-width="4xl" @close="handleClose">
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Export Card</h2>
        <p class="text-sm text-gray-500 mt-1">
          Download your greeting card
        </p>
      </div>
      <button
        v-if="!isExporting"
        type="button"
        @click="handleClose"
        class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Modal Body -->
    <div class="p-6 space-y-6">
      <!-- Card Preview -->
      <div ref="cardElement" class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <GreetingCard
            :template="props.template"
            :name="props.name"
            :greeting="props.greeting"
            :photo="props.photo"
          />
        </div>
      </div>

      <!-- Export Options -->
      <div class="max-w-md mx-auto space-y-4">
        <!-- Format Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="(format) in formatOptions"
              :key="format.value"
              type="button"
              @click="selectedFormat = format.value"
              :disabled="isExporting"
              :class="[
                'flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all',
                selectedFormat === format.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700',
                isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              <span class="text-2xl">{{ format.icon }}</span>
              <span class="font-medium">{{ format.label }}</span>
            </button>
          </div>
        </div>

        <!-- Filename Input -->
        <div>
          <label for="filename" class="block text-sm font-medium text-gray-700 mb-2">
            Filename
          </label>
          <div class="relative">
            <input
              id="filename"
              v-model="filename"
              type="text"
              :disabled="isExporting"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="greeting-card"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              .{{ selectedFormat }}
            </span>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Final filename: {{ fullFilename }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div v-if="isExporting" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Exporting...</span>
            <span class="text-gray-500">{{ progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="bg-blue-600 h-2 transition-all duration-300 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Error Message -->
        <ErrorMessage v-if="error" :message="error" />

        <!-- Success Message -->
        <div
          v-if="!isExporting && progress === 100 && !error"
          class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Export successful! Your download should start automatically.</span>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
      <BaseButton
        variant="outline"
        :disabled="isExporting"
        @click="handleClose"
      >
        {{ isExporting ? 'Exporting...' : 'Cancel' }}
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="isExporting || !filename.trim()"
        @click="handleExport"
      >
        <svg v-if="!isExporting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isExporting ? 'Exporting...' : 'Export' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
