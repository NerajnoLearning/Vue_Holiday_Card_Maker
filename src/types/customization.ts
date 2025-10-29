export interface TemplateCustomization {
  id: string
  templateId: string
  colors: {
    background?: string
    primary?: string
    secondary?: string
    text?: string
    accent?: string
  }
  fonts: {
    greeting?: string
    name?: string
    body?: string
  }
  layout: {
    textAlign?: 'left' | 'center' | 'right'
    photoSize?: 'small' | 'medium' | 'large'
    photoPosition?: 'top' | 'center' | 'bottom'
    spacing?: 'compact' | 'normal' | 'relaxed'
  }
  createdAt: Date
  updatedAt: Date
}

export interface SavedTemplate extends TemplateCustomization {
  name: string
  preview?: string
  isPublic?: boolean
  shareCode?: string
}

export const DEFAULT_FONTS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System Default' },
  { value: '"Georgia", serif', label: 'Georgia' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: '"Arial", sans-serif', label: 'Arial' },
  { value: '"Helvetica", sans-serif', label: 'Helvetica' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: '"Brush Script MT", cursive', label: 'Brush Script' },
  { value: '"Lucida Handwriting", cursive', label: 'Handwriting' },
  { value: '"Comic Sans MS", cursive', label: 'Comic Sans' },
  { value: '"Impact", sans-serif', label: 'Impact' }
] as const

export const DEFAULT_COLORS = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#EF4444', label: 'Red' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#84CC16', label: 'Lime' },
  { value: '#F97316', label: 'Orange' },
  { value: '#6366F1', label: 'Indigo' }
] as const
