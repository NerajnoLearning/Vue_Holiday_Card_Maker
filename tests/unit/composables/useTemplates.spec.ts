import { describe, it, expect } from 'vitest'
import { useTemplates } from '@/composables/useTemplates'
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates'

describe('useTemplates', () => {
  it('initializes with first template selected', () => {
    const { selectedTemplate } = useTemplates()

    expect(selectedTemplate.value).toEqual(HOLIDAY_TEMPLATES[0])
    expect(selectedTemplate.value.id).toBe('christmas')
  })

  it('returns all templates via computed property', () => {
    const { templates } = useTemplates()

    expect(templates.value).toHaveLength(4)
    expect(templates.value).toEqual(HOLIDAY_TEMPLATES)
  })

  it('selects template by id', () => {
    const { selectedTemplate, selectTemplate } = useTemplates()

    selectTemplate('valentine')

    expect(selectedTemplate.value.id).toBe('valentine')
    expect(selectedTemplate.value.name).toBe('Valentine')
  })

  it('handles selecting non-existent template gracefully', () => {
    const { selectedTemplate, selectTemplate } = useTemplates()
    const initialTemplate = selectedTemplate.value

    selectTemplate('non-existent')

    // Should remain unchanged
    expect(selectedTemplate.value).toEqual(initialTemplate)
  })

  it('gets template by id', () => {
    const { getTemplateById } = useTemplates()

    const template = getTemplateById('newyear')

    expect(template).toBeDefined()
    expect(template?.id).toBe('newyear')
    expect(template?.name).toBe('New Year')
  })

  it('returns undefined for non-existent template id', () => {
    const { getTemplateById } = useTemplates()

    const template = getTemplateById('non-existent')

    expect(template).toBeUndefined()
  })

  it('gets default greeting from selected template', () => {
    const { getDefaultGreeting, selectTemplate } = useTemplates()

    selectTemplate('birthday')

    const greeting = getDefaultGreeting()

    expect(greeting).toBe('Happy Birthday! Wishing you a wonderful day!')
  })

  it('gets default greeting by template id', () => {
    const { getDefaultGreeting } = useTemplates()

    const greeting = getDefaultGreeting('christmas')

    expect(greeting).toBe('Merry Christmas and Happy New Year!')
  })

  it('returns empty string for non-existent template default greeting', () => {
    const { getDefaultGreeting } = useTemplates()

    const greeting = getDefaultGreeting('non-existent')

    expect(greeting).toBe('')
  })

  it('all templates have required properties', () => {
    const { templates } = useTemplates()

    templates.value.forEach((template) => {
      expect(template).toHaveProperty('id')
      expect(template).toHaveProperty('name')
      expect(template).toHaveProperty('background')
      expect(template).toHaveProperty('thumbnail')
      expect(template).toHaveProperty('defaultGreeting')
      expect(template).toHaveProperty('colors')
      expect(template.colors).toHaveProperty('primary')
      expect(template.colors).toHaveProperty('secondary')
      expect(template.colors).toHaveProperty('text')
    })
  })

  it('all template ids are unique', () => {
    const { templates } = useTemplates()

    const ids = templates.value.map((t) => t.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all templates have valid background paths', () => {
    const { templates } = useTemplates()

    templates.value.forEach((template) => {
      expect(template.background).toContain('/assets/templates/backgrounds/')
      expect(template.background).toMatch(/\.(jpg|jpeg|png|webp)$/i)
    })
  })

  it('all templates have valid thumbnail paths', () => {
    const { templates } = useTemplates()

    templates.value.forEach((template) => {
      expect(template.thumbnail).toContain('/assets/templates/thumbnails/')
      expect(template.thumbnail).toMatch(/\.(jpg|jpeg|png|webp)$/i)
    })
  })

  it('template colors are valid hex codes', () => {
    const { templates } = useTemplates()
    const hexPattern = /^#[0-9a-f]{6}$/i

    templates.value.forEach((template) => {
      expect(template.colors.primary).toMatch(hexPattern)
      expect(template.colors.secondary).toMatch(hexPattern)
      expect(template.colors.text).toMatch(hexPattern)
    })
  })

  it('maintains reactivity when template changes', () => {
    const { selectedTemplate, selectTemplate } = useTemplates()

    const initialId = selectedTemplate.value.id
    selectTemplate('valentine')
    const newId = selectedTemplate.value.id

    expect(initialId).not.toBe(newId)
    expect(newId).toBe('valentine')
  })
})
