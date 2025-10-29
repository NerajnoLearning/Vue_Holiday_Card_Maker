import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generatePDF, generatePDFBlob, type PDFOptions } from '@/utils/export/pdf-generator'

// Mock jsPDF
vi.mock('jspdf', () => {
  const mockSave = vi.fn()
  const mockOutput = vi.fn(() => new Blob(['mock-pdf'], { type: 'application/pdf' }))
  const mockAddImage = vi.fn()

  return {
    default: vi.fn().mockImplementation(() => ({
      save: mockSave,
      output: mockOutput,
      addImage: mockAddImage,
    })),
  }
})

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockImplementation(() =>
    Promise.resolve({
      width: 800,
      height: 600,
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,mockImageData'),
    }),
  ),
}))

describe('pdf-generator', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockElement.innerHTML = '<p>Test Card</p>'
    vi.clearAllMocks()
  })

  describe('generatePDF', () => {
    it('should generate PDF successfully with default options', async () => {
      const result = await generatePDF(mockElement)

      expect(result.success).toBe(true)
      expect(result.filename).toBeDefined()
      expect(result.filename).toMatch(/greeting-card_\d{8}_\d{6}\.pdf/)
      expect(result.error).toBeUndefined()
    })

    it('should generate PDF with custom filename', async () => {
      const options: PDFOptions = {
        filename: 'my-card.pdf',
        includeTimestamp: false,
      }
      const result = await generatePDF(mockElement, options)

      expect(result.success).toBe(true)
      expect(result.filename).toBe('my-card.pdf')
    })

    it('should add timestamp to filename when includeTimestamp is true', async () => {
      const options: PDFOptions = {
        filename: 'test.pdf',
        includeTimestamp: true,
      }
      const result = await generatePDF(mockElement, options)

      expect(result.success).toBe(true)
      expect(result.filename).toMatch(/test_\d{8}_\d{6}\.pdf/)
      expect(result.filename).not.toBe('test.pdf')
    })

    it('should handle different orientations', async () => {
      const optionsPortrait: PDFOptions = { orientation: 'portrait' }
      const resultPortrait = await generatePDF(mockElement, optionsPortrait)

      expect(resultPortrait.success).toBe(true)

      const optionsLandscape: PDFOptions = { orientation: 'landscape' }
      const resultLandscape = await generatePDF(mockElement, optionsLandscape)

      expect(resultLandscape.success).toBe(true)
    })

    it('should use custom quality setting', async () => {
      const options: PDFOptions = { quality: 0.8 }
      const result = await generatePDF(mockElement, options)

      expect(result.success).toBe(true)
    })
  })

  describe('generatePDFBlob', () => {
    it('should generate PDF blob successfully', async () => {
      const blob = await generatePDFBlob(mockElement)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob?.type).toBe('application/pdf')
    })

    it('should generate PDF blob with custom options', async () => {
      const options: PDFOptions = {
        quality: 0.9,
        orientation: 'landscape',
      }
      const blob = await generatePDFBlob(mockElement, options)

      expect(blob).toBeInstanceOf(Blob)
    })
  })
})
