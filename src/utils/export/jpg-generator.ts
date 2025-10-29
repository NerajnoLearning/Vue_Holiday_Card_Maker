import html2canvas from 'html2canvas'

export interface JPGOptions {
  filename?: string
  quality?: number
  scale?: number
  backgroundColor?: string
  includeTimestamp?: boolean
}

export interface JPGResult {
  success: boolean
  filename?: string
  dataUrl?: string
  error?: string
}

/**
 * Generate a timestamp string for filenames
 * Format: YYYYMMDD_HHMMSS
 */
const generateTimestamp = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

/**
 * Add timestamp to filename before extension
 */
const addTimestampToFilename = (filename: string): string => {
  const timestamp = generateTimestamp()
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return `${filename}_${timestamp}`
  }
  const nameWithoutExt = filename.substring(0, lastDotIndex)
  const ext = filename.substring(lastDotIndex)
  return `${nameWithoutExt}_${timestamp}${ext}`
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
    backgroundColor = '#ffffff',
    includeTimestamp = true
  } = options

  // Add timestamp to filename if requested
  const finalFilename = includeTimestamp ? addTimestampToFilename(filename) : filename

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
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return {
      success: true,
      filename: finalFilename,
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
