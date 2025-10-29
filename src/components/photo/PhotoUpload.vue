<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import PhotoPreview from '@/components/photo/PhotoPreview.vue'
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import type { ResizeProgress } from '@/utils/image/image-resizer'

const emit = defineEmits<{
  upload: [file: File | null]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dropActive = ref(false)
const progress = ref<ResizeProgress | null>(null)

const {
  previewUrl,
  dataUrl,
  loading,
  error,
  handleInputFile,
  remove,
  getProcessedFile,
} = usePhotoUpload()

const triggerUpload = () => fileInput.value?.click()

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  progress.value = null
  const result = await handleInputFile(file ?? null, (p) => {
    progress.value = p
  })
  // emit processed file if available
  if (result && result.blob) {
    // convert to File before emitting
    const processedFile = getProcessedFile(file?.name ?? 'photo.jpg')
    emit('upload', processedFile)
  } else if (!file) {
    emit('upload', null)
  } else {
    emit('upload', null)
  }
  progress.value = null
}

const onRemove = () => {
  remove()
  if (fileInput.value) fileInput.value.value = ''
  emit('upload', null)
}

// Drag & drop handlers
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  dropActive.value = true
}
const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dropActive.value = false
}
const onDrop = async (e: DragEvent) => {
  e.preventDefault()
  dropActive.value = false
  const file = e.dataTransfer?.files?.[0] ?? null
  progress.value = null
  const result = await handleInputFile(file ?? null, (p) => {
    progress.value = p
  })
  if (result && result.blob) {
    const processedFile = getProcessedFile(file?.name ?? 'photo.jpg')
    emit('upload', processedFile)
  } else {
    emit('upload', null)
  }
  progress.value = null
}
</script>

<template>
  <div class="space-y-3">
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      class="hidden"
      @change="onFileChange"
    />

    <div
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="['border-2 rounded-lg p-6 text-center transition-colors', dropActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white']"
    >
      <div v-if="!previewUrl">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">Drag & drop a photo, or click to browse</p>
        <p class="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
        <BaseButton @click.prevent="triggerUpload" class="mt-4">Choose Photo</BaseButton>
      </div>

      <div v-else>
        <PhotoPreview :src="dataUrl || previewUrl" :loading="loading" @remove="onRemove" />
      </div>
    </div>

    <!-- Progress indicator -->
    <div v-if="loading && progress" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">{{ progress.message }}</span>
        <span class="text-gray-500">{{ progress.progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          class="bg-blue-600 h-2 transition-all duration-300 ease-out"
          :style="{ width: `${progress.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error">
      <ErrorMessage :message="error" />
    </div>
  </div>
</template>
