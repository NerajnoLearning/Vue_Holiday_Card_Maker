import { ref, computed } from 'vue'
import type { TemplateCustomization, SavedTemplate } from '@/types/customization'
import { handleError } from '@/utils/error-logger'

const STORAGE_KEY = 'greeting-card-customizations'

export const useCustomization = () => {
  const savedTemplates = ref<SavedTemplate[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load saved templates from localStorage
   */
  const loadSavedTemplates = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        savedTemplates.value = parsed.map((template: SavedTemplate) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt)
        }))
      }
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to load saved templates', 'medium')
      error.value = errorMsg
    }
  }

  /**
   * Save templates to localStorage
   */
  const persistTemplates = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTemplates.value))
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to save templates', 'high')
      error.value = errorMsg
      throw err
    }
  }

  /**
   * Generate a unique share code
   */
  const generateShareCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    do {
      code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    } while (savedTemplates.value.some(template => template.shareCode === code))
    return code
  }

  /**
   * Save a new customization
   */
  const saveCustomization = async (
    customization: TemplateCustomization,
    name: string,
    preview?: string,
    isPublic: boolean = false
  ): Promise<SavedTemplate | null> => {
    isLoading.value = true
    error.value = null

    try {
      const savedTemplate: SavedTemplate = {
        ...customization,
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name,
        preview,
        isPublic,
        shareCode: isPublic ? generateShareCode() : undefined,
        updatedAt: new Date()
      }

      savedTemplates.value.push(savedTemplate)
      persistTemplates()

      return savedTemplate
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to save customization', 'high', {
        name,
        templateId: customization.templateId
      })
      error.value = errorMsg
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing customization
   */
  const updateCustomization = async (
    id: string,
    updates: Partial<SavedTemplate>
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const index = savedTemplates.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Template not found')
      }

      savedTemplates.value[index] = {
        ...savedTemplates.value[index],
        ...updates,
        updatedAt: new Date()
      }

      persistTemplates()
      return true
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to update customization', 'high', { id })
      error.value = errorMsg
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a saved customization
   */
  const deleteCustomization = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const index = savedTemplates.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Template not found')
      }

      savedTemplates.value.splice(index, 1)
      persistTemplates()
      return true
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to delete customization', 'high', { id })
      error.value = errorMsg
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a customization by ID
   */
  const getCustomizationById = (id: string): SavedTemplate | undefined => {
    return savedTemplates.value.find(t => t.id === id)
  }

  /**
   * Get a customization by share code
   */
  const getCustomizationByShareCode = (shareCode: string): SavedTemplate | undefined => {
    return savedTemplates.value.find(
      t => t.isPublic && t.shareCode === shareCode.toUpperCase()
    )
  }

  /**
   * Export customization as JSON
   */
  const exportCustomization = (id: string): string | null => {
    try {
      const customization = getCustomizationById(id)
      if (!customization) {
        throw new Error('Template not found')
      }

      return JSON.stringify(customization, null, 2)
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to export customization', 'medium', { id })
      error.value = errorMsg
      return null
    }
  }

  /**
   * Import customization from JSON
   */
  const importCustomization = async (jsonString: string): Promise<SavedTemplate | null> => {
    isLoading.value = true
    error.value = null

    try {
      const parsed = JSON.parse(jsonString)

      // Validate required fields
      if (!parsed.templateId || !parsed.name) {
        throw new Error('Invalid customization data')
      }

      // Generate new ID and timestamps
      const imported: SavedTemplate = {
        ...parsed,
        id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareCode: parsed.isPublic ? generateShareCode() : undefined
      }

      savedTemplates.value.push(imported)
      persistTemplates()

      return imported
    } catch (err) {
      const errorMsg = handleError(err, 'Failed to import customization', 'medium')
      error.value = errorMsg
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get all public customizations
   */
  const publicTemplates = computed(() =>
    savedTemplates.value.filter(t => t.isPublic)
  )

  /**
   * Get all private customizations
   */
  const privateTemplates = computed(() =>
    savedTemplates.value.filter(t => !t.isPublic)
  )

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  // Load templates on initialization
  loadSavedTemplates()

  return {
    savedTemplates,
    publicTemplates,
    privateTemplates,
    isLoading,
    error,
    saveCustomization,
    updateCustomization,
    deleteCustomization,
    getCustomizationById,
    getCustomizationByShareCode,
    exportCustomization,
    importCustomization,
    clearError
  }
}
