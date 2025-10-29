/*
 Client-side image resizing/compression utility.
 Exports:
 - resizeImage(file, options) => { blob, dataUrl, width, height }

 Uses an offscreen canvas to redraw the image at a constrained size while keeping aspect ratio.
 */

export interface ResizeOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number; // 0..1 for JPEG
	mimeType?: string; // output mime type
}

export interface ResizeResult {
	blob: Blob;
	dataUrl: string;
	width: number;
	height: number;
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

export async function resizeImage(file: File, opts: ResizeOptions = {}): Promise<ResizeResult> {
	const { maxWidth = 1200, maxHeight = 1200, quality = 0.9, mimeType = 'image/jpeg' } = opts

	const img = await loadImageFromFile(file)

	const ratio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight, 1)
	const targetWidth = Math.round(img.naturalWidth * ratio)
	const targetHeight = Math.round(img.naturalHeight * ratio)

	const canvas = document.createElement('canvas')
	canvas.width = targetWidth
	canvas.height = targetHeight
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Could not get canvas context')

	// Draw with smoothing for better quality
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

	return new Promise<ResizeResult>((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) return reject(new Error('Failed to create blob from canvas'))
				const reader = new FileReader()
				reader.onloadend = () => {
					resolve({ blob, dataUrl: reader.result as string, width: targetWidth, height: targetHeight })
				}
				reader.onerror = () => reject(new Error('Failed to read blob'))
				reader.readAsDataURL(blob)
			},
			mimeType,
			quality
		)
	})
}

// Helper to convert blob to File (if upstream expects File)
export function blobToFile(blob: Blob, fileName: string): File {
	return new File([blob], fileName, { type: blob.type })
}

export default resizeImage
