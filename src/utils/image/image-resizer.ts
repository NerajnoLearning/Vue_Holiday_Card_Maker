/*
 Client-side image resizing/compression utility.
 Exports:
 - resizeImage(file, options) => { blob, dataUrl, width, height }

 Uses an offscreen canvas to redraw the image at a constrained size while keeping aspect ratio.
 */

export interface ResizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
}

export interface ResizeProgress {
  stage: 'loading' | 'processing' | 'compressing' | 'done'
  progress: number
  message: string
}

export interface ResizeResult {
  blob: Blob
  dataUrl: string
  url: string
  width: number
  height: number
  size: number
  type: string
  originalSize: number
  savedBytes: number
}

function calculateAspectRatio(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth
  let height = originalHeight

  // Calculate the aspect ratio
  const aspectRatio = width / height

  // Calculate new dimensions while maintaining aspect ratio
  if (width > maxWidth) {
    width = maxWidth
    height = width / aspectRatio
  }

  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }

  // Ensure dimensions are integers
  return {
    width: Math.round(width),
    height: Math.round(height)
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

// Compression levels for different image types
const COMPRESSION_LEVELS = {
	'image/jpeg': 0.8, // Standard quality for JPEG (lower than PNG)
	'image/jpg': 0.8, // Standard quality for JPG (lower than PNG)
	'image/png': 0.9, // Highest quality for PNG
	'image/webp': 0.8, // Standard quality for WebP (lower than PNG)
} as const;

// Cache WebP support detection to avoid expensive repeated checks
let webpSupportCache: boolean | null = null;

/**
 * Checks if the browser supports WebP format.
 * Uses a small 1x1 canvas to minimize performance impact.
 * Result is cached after first check.
 */
function supportsWebP(): boolean {
	if (webpSupportCache !== null) {
		return webpSupportCache;
	}

	try {
		// Create a minimal 1x1 canvas for the check
		const testCanvas = document.createElement('canvas');
		testCanvas.width = 1;
		testCanvas.height = 1;
		
		// Check if toDataURL returns a valid WebP data URL
		const dataUrl = testCanvas.toDataURL('image/webp');
		webpSupportCache = dataUrl.startsWith('data:image/webp');
		
		return webpSupportCache;
	} catch (e) {
		// If any error occurs, assume WebP is not supported
		webpSupportCache = false;
		return false;
	}
}

export const resizeImage = (
	file: File,
	options: ResizeOptions,
	onProgress?: (progress: ResizeProgress) => void
): Promise<ResizeResult> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		const updateProgress = (stage: ResizeProgress['stage'], progress: number, message: string) => {
			onProgress?.({
				stage,
				progress: Math.min(100, Math.max(0, progress)),
				message,
			});
		};

		updateProgress('loading', 10, 'Reading file...');

		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				updateProgress('processing', 30, 'Processing image...');

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					return reject(new Error('Could not get canvas context'));
				}

				// Calculate new dimensions
				let { width, height } = calculateAspectRatio(
					img.width,
					img.height,
					options.maxWidth || img.width,
					options.maxHeight || img.height
				);

				// Set canvas dimensions
				canvas.width = width;
				canvas.height = height;

				// Apply image smoothing for better quality
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';

				// Draw image with new dimensions
				ctx.drawImage(img, 0, 0, width, height);

				// Determine best quality based on file type
				const fileType = file.type as keyof typeof COMPRESSION_LEVELS;
				const quality = options.quality ?? COMPRESSION_LEVELS[fileType] ?? 0.8;

				updateProgress('compressing', 70, 'Optimizing image...');

				// Convert to blob with specified quality
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							return reject(new Error('Failed to create image blob'));
						}

						// Create WebP version if original is a different format and browser supports it
						const shouldConvertToWebP = file.type !== 'image/webp' && supportsWebP();

						const processBlob = (finalBlob: Blob, type: string) => {
							const url = URL.createObjectURL(finalBlob);
							const reader = new FileReader();

							reader.onload = () => {
								updateProgress('done', 100, 'Done!');

								resolve({
									blob: finalBlob,
									url,
									dataUrl: reader.result as string,
									width,
									height,
									size: finalBlob.size,
									type: finalBlob.type,
									originalSize: file.size,
									savedBytes: file.size - finalBlob.size,
								});
							};

							reader.onerror = () => reject(new Error('Failed to read processed file'));
							reader.readAsDataURL(finalBlob);
						};

						if (shouldConvertToWebP) {
							// Convert to WebP for better compression
							canvas.toBlob(
								(webpBlob) => {
									if (!webpBlob) return processBlob(blob, blob.type);
									processBlob(webpBlob, 'image/webp');
								},
								'image/webp',
								quality
							);
						} else {
							processBlob(blob, blob.type);
						}
					},
					file.type,
					quality
				);
			};

			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = event.target?.result as string;
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
};

// Helper to convert blob to File (if upstream expects File)
export function blobToFile(blob: Blob, fileName: string): File {
	return new File([blob], fileName, { type: blob.type })
}

export default resizeImage
