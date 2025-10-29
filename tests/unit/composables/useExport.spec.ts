import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useExport } from '@/composables/useExport'

// Mock the export utilities
vi.mock('@/utils/export/pdf-generator', () => ({
  generatePDF: vi.fn().mockResolvedValue({ success: true, filename: 'test.pdf' }),
}))

vi.mock('@/utils/export/jpg-generator', () => ({
  generateJPG: vi.fn().mockResolvedValue({ success: true, filename: 'test.jpg' }),
}))

vi.mock('@/utils/retry', () => ({
  retryAsync: vi.fn((fn) => fn()),
}))

vi.mock('@/utils/error-logger', () => ({
  handleError: vi.fn((error) => error.message || 'Unknown error'),
}))

describe('useExport', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockElement.innerHTML = '<p>Test Card</p>'
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with default state', () => {
    const { isExporting, error, progress, currentFormat, retryCount } = useExport()

    expect(isExporting.value).toBe(false)
    expect(error.value).toBeNull()
    expect(progress.value).toBe(0)
    expect(currentFormat.value).toBeNull()
    expect(retryCount.value).toBe(0)
  })

  it('should export PDF successfully', async () => {
    const { exportAsPDF, isExporting, error, currentFormat, progress } = useExport()

    const promise = exportAsPDF(mockElement, { filename: 'test.pdf' })

    expect(isExporting.value).toBe(true)
    expect(currentFormat.value).toBe('pdf')

    const result = await promise

    expect(result).toBe(true)
    expect(error.value).toBeNull()
    expect(progress.value).toBe(100)
    expect(isExporting.value).toBe(false)
  })

  it('should export JPG successfully', async () => {
    const { exportAsJPG, isExporting, error, currentFormat, progress } = useExport()

    const promise = exportAsJPG(mockElement, { filename: 'test.jpg' })

    expect(isExporting.value).toBe(true)
    expect(currentFormat.value).toBe('jpg')

    const result = await promise

    expect(result).toBe(true)
    expect(error.value).toBeNull()
    expect(progress.value).toBe(100)
    expect(isExporting.value).toBe(false)
  })

  it('should handle null element for PDF export', async () => {
    const { exportAsPDF, error } = useExport()

    const result = await exportAsPDF(null)

    expect(result).toBe(false)
    expect(error.value).toContain('No element provided')
  })

  it('should handle null element for JPG export', async () => {
    const { exportAsJPG, error } = useExport()

    const result = await exportAsJPG(null)

    expect(result).toBe(false)
    expect(error.value).toContain('No element provided')
  })

  it('should export card in specified format (PDF)', async () => {
    const { exportCard } = useExport()

    const result = await exportCard(mockElement, { format: 'pdf', filename: 'card.pdf' })

    expect(result).toBe(true)
  })

  it('should export card in specified format (JPG)', async () => {
    const { exportCard } = useExport()

    const result = await exportCard(mockElement, { format: 'jpg', filename: 'card.jpg' })

    expect(result).toBe(true)
  })

  it('should reset export state', async () => {
    const { exportAsPDF, reset, isExporting, error, progress, currentFormat } = useExport()

    await exportAsPDF(mockElement)
    reset()

    expect(isExporting.value).toBe(false)
    expect(error.value).toBeNull()
    expect(progress.value).toBe(0)
    expect(currentFormat.value).toBeNull()
  })

  it('should track progress during export', async () => {
    const { exportAsPDF, progress } = useExport()

    expect(progress.value).toBe(0)

    const promise = exportAsPDF(mockElement)

    await promise

    expect(progress.value).toBe(100)
  })
})
