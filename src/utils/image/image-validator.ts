export interface ValidationOptions {
	maxSize?: number; // bytes
	allowedTypes?: string[];
}

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export function validateImageFile(file: File, opts: ValidationOptions = {}): ValidationResult {
	if (!file) return { valid: false, error: 'No file provided' }

	const maxSize = opts.maxSize ?? DEFAULT_MAX_SIZE
	const allowed = opts.allowedTypes ?? DEFAULT_ALLOWED

	if (!allowed.includes(file.type)) {
		return { valid: false, error: 'Unsupported file type. Allowed: JPG, PNG, WebP' }
	}

	if (file.size > maxSize) {
		return { valid: false, error: `File is too large. Max ${Math.round(maxSize / 1024 / 1024)}MB` }
	}

	return { valid: true }
}

export { DEFAULT_MAX_SIZE as MAX_IMAGE_FILE_SIZE, DEFAULT_ALLOWED as ALLOWED_IMAGE_TYPES }
