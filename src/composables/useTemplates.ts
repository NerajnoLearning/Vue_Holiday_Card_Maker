import { ref, computed } from 'vue'
import type { HolidayTemplate } from '@/types/template'
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates'

export const useTemplates = () => {
  const selectedTemplate = ref<HolidayTemplate>(HOLIDAY_TEMPLATES[0])

  const templates = computed(() => HOLIDAY_TEMPLATES)

  const selectTemplate = (templateId: string) => {
    const template = HOLIDAY_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      selectedTemplate.value = template
    }
  }

  const getTemplateById = (templateId: string): HolidayTemplate | undefined => {
    return HOLIDAY_TEMPLATES.find((t) => t.id === templateId)
  }

  const getDefaultGreeting = (templateId?: string): string => {
    const template = templateId ? getTemplateById(templateId) : selectedTemplate.value
    return template?.defaultGreeting || ''
  }

  return {
    templates,
    selectedTemplate,
    selectTemplate,
    getTemplateById,
    getDefaultGreeting
  }
}
