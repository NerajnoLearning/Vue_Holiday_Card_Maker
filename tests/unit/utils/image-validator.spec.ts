import { describe, it, expect } from 'vitest'
import { validateImageFile, MAX_IMAGE_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/utils/image/image-validator'

describe('image-validator', () => {
  // Helper to create mock File objects
  const createMockFile = (type: string, size: number, name = 'test.jpg'): File => {
    const blob = new Blob(['x'.repeat(size)], { type })
    return new File([blob], name, { type })
  }

  describe('validateImageFile', () => {
    it('should accept valid JPEG files under size limit', () => {
      const file = createMockFile('image/jpeg', 1024 * 1024) // 1MB
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid PNG files under size limit', () => {
      const file = createMockFile('image/png', 2 * 1024 * 1024) // 2MB
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid WebP files under size limit', () => {
      const file = createMockFile('image/webp', 3 * 1024 * 1024) // 3MB
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files that are too large', () => {
      const file = createMockFile('image/jpeg', 6 * 1024 * 1024) // 6MB (over 5MB limit)
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too large')
    })

    it('should reject unsupported file types', () => {
      const file = createMockFile('image/gif', 1024 * 1024) // GIF not allowed
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Unsupported file type')
    })

    it('should reject non-image files', () => {
      const file = createMockFile('application/pdf', 1024 * 1024)
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Unsupported file type')
    })

    it('should handle custom max size option', () => {
      const file = createMockFile('image/jpeg', 2 * 1024 * 1024) // 2MB
      const result = validateImageFile(file, { maxSize: 1024 * 1024 }) // 1MB limit
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too large')
    })

    it('should handle custom allowed types option', () => {
      const file = createMockFile('image/png', 1024 * 1024)
      const result = validateImageFile(file, { allowedTypes: ['image/jpeg'] })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Unsupported file type')
    })

    it('should accept JPG variant mime type', () => {
      const file = createMockFile('image/jpg', 1024 * 1024)
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })
  })

  describe('constants', () => {
    it('should export MAX_IMAGE_FILE_SIZE constant', () => {
      expect(MAX_IMAGE_FILE_SIZE).toBe(5 * 1024 * 1024)
    })

    it('should export ALLOWED_IMAGE_TYPES constant', () => {
      expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/jpg')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/png')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/webp')
    })
  })
})
