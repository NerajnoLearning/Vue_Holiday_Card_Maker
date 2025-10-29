import { ref } from 'vue'
import { generatePDF, type PDFOptions } from '@/utils/export/pdf-generator'
import { generateJPG, type JPGOptions } from '@/utils/export/jpg-generator'

export type ExportFormat = 'pdf' | 'jpg'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  quality?: number
}

export const useExport = () => {
  const isExporting = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  const currentFormat = ref<ExportFormat | null>(null)

  /**
   * Export card as PDF
   */
  const exportAsPDF = async (
    element: HTMLElement | null,
    options: PDFOptions = {}
  ): Promise<boolean> => {
    if (!element) {
      error.value = 'No element provided for export'
      return false
    }

    isExporting.value = true
    error.value = null
    currentFormat.value = 'pdf'
    progress.value = 0

    try {
      // Simulate progress
      progress.value = 30

      const result = await generatePDF(element, options)

      progress.value = 100

      if (!result.success) {
        error.value = result.error || 'PDF export failed'
        return false
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'PDF export failed'
      return false
    } finally {
      isExporting.value = false
      currentFormat.value = null
      // Reset progress after a delay
      setTimeout(() => {
        progress.value = 0
      }, 1000)
    }
  }

  /**
   * Export card as JPG
   */
  const exportAsJPG = async (
    element: HTMLElement | null,
    options: JPGOptions = {}
  ): Promise<boolean> => {
    if (!element) {
      error.value = 'No element provided for export'
      return false
    }

    isExporting.value = true
    error.value = null
    currentFormat.value = 'jpg'
    progress.value = 0

    try {
      // Simulate progress
      progress.value = 30

      const result = await generateJPG(element, options)

      progress.value = 100

      if (!result.success) {
        error.value = result.error || 'JPG export failed'
        return false
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'JPG export failed'
      return false
    } finally {
      isExporting.value = false
      currentFormat.value = null
      // Reset progress after a delay
      setTimeout(() => {
        progress.value = 0
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
    exportAsPDF,
    exportAsJPG,
    exportCard,
    reset
  }
}
