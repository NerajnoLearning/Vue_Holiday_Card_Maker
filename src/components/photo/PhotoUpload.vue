<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const emit = defineEmits<{
  upload: [photo: File | null]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const error = ref<string>('')

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  error.value = ''

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.value = 'Please upload a JPG or PNG image'
    return
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    error.value = 'File size must be less than 5MB'
    return
  }

  uploadedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  emit('upload', file)
}

const handleRemove = () => {
  uploadedFile.value = null
  previewUrl.value = ''
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('upload', null)
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const hasPhoto = computed(() => !!uploadedFile.value)
</script>

<template>
  <div class="space-y-4">
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      class="hidden"
      @change="handleFileSelect"
    />

    <div v-if="!hasPhoto" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-2 text-sm text-gray-600">Click to upload a photo</p>
      <p class="text-xs text-gray-500 mt-1">JPG or PNG (max 5MB)</p>
      <BaseButton @click="triggerUpload" class="mt-4">
        Choose Photo
      </BaseButton>
    </div>

    <div v-else class="relative">
      <img
        :src="previewUrl"
        alt="Uploaded photo"
        class="w-full h-48 object-cover rounded-lg"
      />
      <button
        type="button"
        @click="handleRemove"
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>
