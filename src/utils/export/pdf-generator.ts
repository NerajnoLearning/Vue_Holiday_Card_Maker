import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFOptions {
  filename?: string
  quality?: number
  orientation?: 'portrait' | 'landscape'
  format?: 'a4' | 'letter'
}

export interface PDFResult {
  success: boolean
  filename?: string
  error?: string
}

/**
 * Generates a PDF from an HTML element
 * @param element - The HTML element to convert
 * @param options - PDF generation options
 * @returns Promise with generation result
 */
export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<PDFResult> => {
  const {
    filename = 'greeting-card.pdf',
    quality = 0.95,
    orientation = 'portrait',
    format = 'a4'
  } = options

  try {
    // Convert HTML element to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true, // Allow cross-origin images
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true
    })

    // Get canvas dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // Create jsPDF instance
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [imgWidth, imgHeight],
      compress: true
    })

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/jpeg', quality)

    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST')

    // Save the PDF
    pdf.save(filename)

    return {
      success: true,
      filename
    }
  } catch (error) {
    console.error('PDF generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    }
  }
}

/**
 * Generate PDF and return as blob (for preview or upload)
 */
export const generatePDFBlob = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob | null> => {
  const { quality = 0.95, orientation = 'portrait' } = options

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgWidth = canvas.width
    const imgHeight = canvas.height

    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [imgWidth, imgHeight],
      compress: true
    })

    const imgData = canvas.toDataURL('image/jpeg', quality)
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST')

    return pdf.output('blob')
  } catch (error) {
    console.error('PDF blob generation failed:', error)
    return null
  }
}
