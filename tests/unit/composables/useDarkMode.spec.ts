import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDarkMode } from '@/composables/useDarkMode'

describe('useDarkMode', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Remove dark class from document
    document.documentElement.classList.remove('dark')
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { isDark, theme } = useDarkMode()

    expect(isDark.value).toBeDefined()
    expect(theme.value).toBe('system')
  })

  it('should toggle dark mode', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    const initialState = isDark.value
    toggleDarkMode()

    expect(isDark.value).not.toBe(initialState)
  })

  it('should set theme to dark', () => {
    const { theme, setTheme } = useDarkMode()

    setTheme('dark')

    expect(theme.value).toBe('dark')
    expect(localStorage.getItem('greeting-card-maker-theme')).toBe('dark')
  })

  it('should set theme to light', () => {
    const { theme, setTheme } = useDarkMode()

    setTheme('light')

    expect(theme.value).toBe('light')
    expect(localStorage.getItem('greeting-card-maker-theme')).toBe('light')
  })

  it('should persist theme preference to localStorage', () => {
    const { setTheme } = useDarkMode()

    setTheme('dark')

    expect(localStorage.getItem('greeting-card-maker-theme')).toBe('dark')
  })

  it('should apply dark class to document when dark mode is enabled', () => {
    const { setTheme } = useDarkMode()

    setTheme('dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should remove dark class from document when light mode is enabled', () => {
    const { setTheme } = useDarkMode()

    // First set to dark
    setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Then set to light
    setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should expose initializeDarkMode function', () => {
    const { initializeDarkMode } = useDarkMode()

    expect(typeof initializeDarkMode).toBe('function')
  })

  it('should load saved theme from localStorage', () => {
    // Set a theme in localStorage before initializing
    localStorage.setItem('greeting-card-maker-theme', 'dark')

    const { theme, initializeDarkMode } = useDarkMode()
    initializeDarkMode()

    expect(theme.value).toBe('dark')
  })

  it('should handle system theme preference', () => {
    const { theme, setTheme } = useDarkMode()

    setTheme('system')

    expect(theme.value).toBe('system')
  })
})
