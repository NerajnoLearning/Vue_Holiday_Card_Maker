import { ref } from 'vue'
import { generatePDF, type PDFOptions } from '@/utils/export/pdf-generator'
import { generateJPG, type JPGOptions } from '@/utils/export/jpg-generator'
import { retryAsync } from '@/utils/retry'
import { handleError } from '@/utils/error-logger'

export type ExportFormat = 'pdf' | 'jpg'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  quality?: number
  retry?: boolean
  maxRetries?: number
}

export const useExport = () => {
  const isExporting = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  const currentFormat = ref<ExportFormat | null>(null)
  const retryCount = ref(0)

  /**
   * Export card as PDF with retry support
   */
  const exportAsPDF = async (
    element: HTMLElement | null,
    options: PDFOptions & { retry?: boolean; maxRetries?: number } = {}
  ): Promise<boolean> => {
    if (!element) {
      const errorMsg = 'No element provided for export'
      error.value = errorMsg
      handleError(new Error(errorMsg), errorMsg, 'high', { format: 'pdf' })
      return false
    }

    isExporting.value = true
    error.value = null
    currentFormat.value = 'pdf'
    progress.value = 0
    retryCount.value = 0

    const { retry = false, maxRetries = 3, ...pdfOptions } = options

    try {
      progress.value = 30

      const exportFn = async () => {
        const result = await generatePDF(element, pdfOptions)

        if (!result.success) {
          throw new Error(result.error || 'PDF export failed')
        }

        return result
      }

      // Use retry logic if enabled
      const result = retry
        ? await retryAsync(exportFn, {
            maxAttempts: maxRetries,
            delay: 1000,
            backoff: true,
            onRetry: (attempt) => {
              retryCount.value = attempt
              progress.value = 30 + (attempt * 10)
            }
          })
        : await exportFn()

      progress.value = 100

      return true
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to export PDF', 'high', {
        format: 'pdf',
        retryCount: retryCount.value
      })
      error.value = errorMsg
      return false
    } finally {
      isExporting.value = false
      currentFormat.value = null
      // Reset progress after a delay
      setTimeout(() => {
        progress.value = 0
        retryCount.value = 0
      }, 1000)
    }
  }

  /**
   * Export card as JPG with retry support
   */
  const exportAsJPG = async (
    element: HTMLElement | null,
    options: JPGOptions & { retry?: boolean; maxRetries?: number } = {}
  ): Promise<boolean> => {
    if (!element) {
      const errorMsg = 'No element provided for export'
      error.value = errorMsg
      handleError(new Error(errorMsg), errorMsg, 'high', { format: 'jpg' })
      return false
    }

    isExporting.value = true
    error.value = null
    currentFormat.value = 'jpg'
    progress.value = 0
    retryCount.value = 0

    const { retry = false, maxRetries = 3, ...jpgOptions } = options

    try {
      progress.value = 30

      const exportFn = async () => {
        const result = await generateJPG(element, jpgOptions)

        if (!result.success) {
          throw new Error(result.error || 'JPG export failed')
        }

        return result
      }

      // Use retry logic if enabled
      const result = retry
        ? await retryAsync(exportFn, {
            maxAttempts: maxRetries,
            delay: 1000,
            backoff: true,
            onRetry: (attempt) => {
              retryCount.value = attempt
              progress.value = 30 + (attempt * 10)
            }
          })
        : await exportFn()

      progress.value = 100

      return true
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to export JPG', 'high', {
        format: 'jpg',
        retryCount: retryCount.value
      })
      error.value = errorMsg
      return false
    } finally {
      isExporting.value = false
      currentFormat.value = null
      // Reset progress after a delay
      setTimeout(() => {
        progress.value = 0
        retryCount.value = 0
      }, 1000)
    }
  }

  /**
   * Export card in specified format
   */
  const exportCard = async (
    element: HTMLElement | null,
    options: ExportOptions
  ): Promise<boolean> => {
    const { format, filename, quality } = options

    if (format === 'pdf') {
      return await exportAsPDF(element, { filename, quality })
    } else {
      return await exportAsJPG(element, { filename, quality })
    }
  }

  /**
   * Reset export state
   */
  const reset = () => {
    isExporting.value = false
    error.value = null
    progress.value = 0
    currentFormat.value = null
  }

  return {
    isExporting,
    error,
    progress,
    currentFormat,
    retryCount,
    exportAsPDF,
    exportAsJPG,
    exportCard,
    reset
  }
}
