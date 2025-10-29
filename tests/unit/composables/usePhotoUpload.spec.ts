import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePhotoUpload } from '@/composables/usePhotoUpload'

// Mock the utilities
vi.mock('@/utils/image/image-validator', () => ({
  validateImageFile: vi.fn((file) => {
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File is too large. Max 5MB' }
    }
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Unsupported file type' }
    }
    return { valid: true }
  }),
  MAX_IMAGE_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}))

vi.mock('@/utils/image/image-resizer', () => ({
  default: vi.fn((file, options, onProgress) => {
    // Simulate progress callbacks
    if (onProgress) {
      onProgress({ stage: 'loading', progress: 10, message: 'Reading file...' })
      onProgress({ stage: 'processing', progress: 50, message: 'Processing image...' })
      onProgress({ stage: 'compressing', progress: 80, message: 'Optimizing image...' })
      onProgress({ stage: 'done', progress: 100, message: 'Done!' })
    }
    return Promise.resolve({
      blob: new Blob(['mock'], { type: 'image/jpeg' }),
      dataUrl: 'data:image/jpeg;base64,mockdata',
      url: 'blob:mock',
      width: 800,
      height: 600,
      size: 100000,
      type: 'image/jpeg',
      originalSize: file.size,
      savedBytes: file.size - 100000
    })
  }),
  blobToFile: vi.fn((blob, filename) => new File([blob], filename, { type: blob.type }))
}))

describe('usePhotoUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  const createMockFile = (type = 'image/jpeg', size = 1024 * 1024): File => {
    const blob = new Blob(['x'.repeat(size)], { type })
    return new File([blob], 'test.jpg', { type })
  }

  it('initializes with empty state', () => {
    const { originalFile, processedBlob, previewUrl, dataUrl, loading, error } = usePhotoUpload()

    expect(originalFile.value).toBeNull()
    expect(processedBlob.value).toBeNull()
    expect(previewUrl.value).toBe('')
    expect(dataUrl.value).toBe('')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('processes valid image file successfully', async () => {
    const { handleInputFile, previewUrl, dataUrl, loading, error, originalFile, processedBlob } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    const result = await handleInputFile(file)

    expect(result).toBeTruthy()
    expect(result?.blob).toBeDefined()
    expect(result?.dataUrl).toBe('data:image/jpeg;base64,mockdata')
    expect(originalFile.value).toBe(file)
    expect(processedBlob.value).toBeDefined()
    expect(previewUrl.value).toBe('blob:mock-url')
    expect(dataUrl.value).toBe('data:image/jpeg;base64,mockdata')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('rejects files that are too large', async () => {
    const { handleInputFile, error } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 6 * 1024 * 1024) // 6MB

    const result = await handleInputFile(file)

    expect(result).toBeNull()
    expect(error.value).toContain('too large')
  })

  it('rejects invalid file types', async () => {
    const { handleInputFile, error } = usePhotoUpload()
    const file = createMockFile('application/pdf', 1024 * 1024)

    const result = await handleInputFile(file)

    expect(result).toBeNull()
    expect(error.value).toContain('Unsupported file type')
  })

  it('calls progress callback during processing', async () => {
    const { handleInputFile } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)
    const progressCallback = vi.fn()

    await handleInputFile(file, progressCallback)

    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({ stage: 'loading', progress: 10 })
    )
    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({ stage: 'processing', progress: 50 })
    )
    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({ stage: 'compressing', progress: 80 })
    )
    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({ stage: 'done', progress: 100 })
    )
  })

  it('resets state when remove is called', async () => {
    const { handleInputFile, remove, previewUrl, dataUrl, originalFile, processedBlob, error } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    await handleInputFile(file)
    expect(previewUrl.value).toBeTruthy()

    remove()

    expect(originalFile.value).toBeNull()
    expect(processedBlob.value).toBeNull()
    expect(previewUrl.value).toBe('')
    expect(dataUrl.value).toBe('')
    expect(error.value).toBeNull()
    expect(global.URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('resets state when handleInputFile is called with null', async () => {
    const { handleInputFile, previewUrl, originalFile } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    await handleInputFile(file)
    expect(previewUrl.value).toBeTruthy()

    const result = await handleInputFile(null)

    expect(result).toBeNull()
    expect(originalFile.value).toBeNull()
    expect(previewUrl.value).toBe('')
  })

  it('returns processed file with correct name', async () => {
    const { handleInputFile, getProcessedFile } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    await handleInputFile(file)
    const processedFile = getProcessedFile('my-photo.jpg')

    expect(processedFile).toBeInstanceOf(File)
    expect(processedFile?.name).toBe('my-photo.jpg')
  })

  it('returns null from getProcessedFile when no blob exists', () => {
    const { getProcessedFile } = usePhotoUpload()

    const result = getProcessedFile('test.jpg')

    expect(result).toBeNull()
  })

  it('handles processing errors gracefully', async () => {
    const resizeImage = await import('@/utils/image/image-resizer')
    vi.mocked(resizeImage.default).mockRejectedValueOnce(new Error('Processing failed'))

    const { handleInputFile, error, processedBlob, dataUrl } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    const result = await handleInputFile(file)

    expect(result).toBeNull()
    expect(error.value).toBe('Processing failed')
    expect(processedBlob.value).toBeNull()
    expect(dataUrl.value).toBe('')
  })

  it('sets loading state correctly during processing', async () => {
    const { handleInputFile, loading } = usePhotoUpload()
    const file = createMockFile('image/jpeg', 2 * 1024 * 1024)

    expect(loading.value).toBe(false)

    const promise = handleInputFile(file)
    // Loading should be true during processing
    expect(loading.value).toBe(true)

    await promise
    // Loading should be false after processing
    expect(loading.value).toBe(false)
  })
})
