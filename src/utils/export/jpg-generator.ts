import html2canvas from 'html2canvas'

export interface JPGOptions {
  filename?: string
  quality?: number
  scale?: number
  backgroundColor?: string
}

export interface JPGResult {
  success: boolean
  filename?: string
  dataUrl?: string
  error?: string
}

/**
 * Generates a JPG image from an HTML element
 * @param element - The HTML element to convert
 * @param options - JPG generation options
 * @returns Promise with generation result
 */
export const generateJPG = async (
  element: HTMLElement,
  options: JPGOptions = {}
): Promise<JPGResult> => {
  const {
    filename = 'greeting-card.jpg',
    quality = 0.92,
    scale = 2,
    backgroundColor = '#ffffff'
  } = options

  try {
    // Convert HTML element to canvas with high quality
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor,
      imageTimeout: 0,
      removeContainer: true
    })

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', quality)

    // Create download link and trigger download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return {
      success: true,
      filename,
      dataUrl
    }
  } catch (error) {
    console.error('JPG generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate JPG'
    }
  }
}

/**
 * Generate JPG and return as data URL (for preview)
 */
export const generateJPGDataURL = async (
  element: HTMLElement,
  options: JPGOptions = {}
): Promise<string | null> => {
  const { quality = 0.92, scale = 2, backgroundColor = '#ffffff' } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor
    })

    return canvas.toDataURL('image/jpeg', quality)
  } catch (error) {
    console.error('JPG data URL generation failed:', error)
    return null
  }
}

/**
 * Generate JPG and return as blob
 */
export const generateJPGBlob = async (
  element: HTMLElement,
  options: JPGOptions = {}
): Promise<Blob | null> => {
  const { quality = 0.92, scale = 2, backgroundColor = '#ffffff' } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor
    })

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/jpeg',
        quality
      )
    })
  } catch (error) {
    console.error('JPG blob generation failed:', error)
    return null
  }
}
