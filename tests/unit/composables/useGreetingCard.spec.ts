import { describe, it, expect } from 'vitest'
import { useGreetingCard } from '@/composables/useGreetingCard'

describe('useGreetingCard', () => {
  it('should initialize with default values', () => {
    const { templateId, name, greeting, photo, isValid } = useGreetingCard()

    expect(templateId.value).toBe('christmas')
    expect(name.value).toBe('')
    expect(greeting.value).toBe('')
    expect(photo.value).toBeNull()
    expect(isValid.value).toBe(false)
  })

  it('should expose all state and actions', () => {
    const result = useGreetingCard()

    // State
    expect(result.templateId).toBeDefined()
    expect(result.template).toBeDefined()
    expect(result.name).toBeDefined()
    expect(result.greeting).toBeDefined()
    expect(result.photo).toBeDefined()

    // Computed
    expect(result.isValid).toBeDefined()

    // Actions
    expect(typeof result.setTemplate).toBe('function')
    expect(typeof result.setName).toBe('function')
    expect(typeof result.setGreeting).toBe('function')
    expect(typeof result.setPhoto).toBe('function')
    expect(typeof result.reset).toBe('function')
  })

  it('should update template', () => {
    const { templateId, setTemplate } = useGreetingCard()

    setTemplate('birthday')
    expect(templateId.value).toBe('birthday')
  })

  it('should update name', () => {
    const { name, setName } = useGreetingCard()

    setName('John')
    expect(name.value).toBe('John')
  })

  it('should update greeting', () => {
    const { greeting, setGreeting } = useGreetingCard()

    setGreeting('Happy Holidays!')
    expect(greeting.value).toBe('Happy Holidays!')
  })

  it('should update photo', () => {
    const { photo, setPhoto } = useGreetingCard()
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    setPhoto(mockFile)
    expect(photo.value).toBe(mockFile)
  })

  it('should validate card - invalid when greeting is empty', () => {
    const { isValid, setTemplate } = useGreetingCard()

    setTemplate('christmas')
    expect(isValid.value).toBe(false)
  })

  it('should validate card - valid when template and greeting exist', () => {
    const { isValid, setTemplate, setGreeting } = useGreetingCard()

    setTemplate('christmas')
    setGreeting('Happy Holidays!')
    expect(isValid.value).toBe(true)
  })

  it('should reset to default values', () => {
    const { templateId, name, greeting, photo, setTemplate, setName, setGreeting, setPhoto, reset } = useGreetingCard()
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    // Set values
    setTemplate('birthday')
    setName('John')
    setGreeting('Happy Birthday!')
    setPhoto(mockFile)

    // Reset
    reset()

    expect(templateId.value).toBe('christmas')
    expect(name.value).toBe('')
    expect(greeting.value).toBe('')
    expect(photo.value).toBeNull()
  })

  it('should compute template object from templateId', () => {
    const { template, setTemplate } = useGreetingCard()

    expect(template.value).toBeDefined()
    expect(template.value?.id).toBe('christmas')
    expect(template.value?.name).toBe('Christmas')

    setTemplate('birthday')
    expect(template.value?.id).toBe('birthday')
    expect(template.value?.name).toBe('Birthday')
  })
})
