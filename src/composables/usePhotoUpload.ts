import { ref } from 'vue'
import { validateImageFile, MAX_IMAGE_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/utils/image/image-validator'
import resizeImage, { blobToFile, type ResizeProgress } from '@/utils/image/image-resizer'

export const usePhotoUpload = () => {
  const originalFile = ref<File | null>(null)
  const processedBlob = ref<Blob | null>(null)
  const previewUrl = ref<string>('')
  const dataUrl = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const reset = () => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    originalFile.value = null
    processedBlob.value = null
    previewUrl.value = ''
    dataUrl.value = ''
    loading.value = false
    error.value = null
  }

  const processFile = async (file: File, onProgress?: (progress: ResizeProgress) => void) => {
    error.value = null
    const validation = validateImageFile(file, { maxSize: MAX_IMAGE_FILE_SIZE, allowedTypes: ALLOWED_IMAGE_TYPES })
    if (!validation.valid) {
      error.value = validation.error || 'Invalid file'
      return null
    }

    originalFile.value = file
    // create an immediate preview from object URL for fast UI
    previewUrl.value = URL.createObjectURL(file)

    try {
      loading.value = true
      // Resize/compress with progress tracking
      const result = await resizeImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.9 }, onProgress)
      processedBlob.value = result.blob
      dataUrl.value = result.dataUrl
      return { blob: result.blob, dataUrl: result.dataUrl }
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to process image'
      processedBlob.value = null
      dataUrl.value = ''
      return null
    } finally {
      loading.value = false
    }
  }

  const handleInputFile = async (file?: File | null, onProgress?: (progress: ResizeProgress) => void) => {
    if (!file) {
      reset()
      return null
    }
    return await processFile(file, onProgress)
  }

  const remove = () => {
    reset()
  }

  // convenience to expose a File object (converted from blob) when needed
  const getProcessedFile = (fileName = 'photo.jpg') => {
    if (!processedBlob.value) return null
    return blobToFile(processedBlob.value, fileName)
  }

  return {
    originalFile,
    processedBlob,
    previewUrl,
    dataUrl,
    loading,
    error,
    handleInputFile,
    remove,
    getProcessedFile,
  }
}
