import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'greeting-card-maker-theme'

// Shared state across all instances
const isDark = ref(false)
const theme = ref<Theme>('system')

export const useDarkMode = () => {
  /**
   * Get the system preference for dark mode
   */
  const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Apply the theme to the document
   */
  const applyTheme = (dark: boolean) => {
    if (typeof document === 'undefined') return

    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * Update the actual dark mode state based on theme setting
   */
  const updateDarkMode = () => {
    if (theme.value === 'system') {
      isDark.value = getSystemPreference()
    } else {
      isDark.value = theme.value === 'dark'
    }
    applyTheme(isDark.value)
  }

  /**
   * Set the theme preference
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEY, newTheme)
    updateDarkMode()
  }

  /**
   * Toggle between light and dark (skips system)
   */
  const toggleDarkMode = () => {
    if (isDark.value) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  /**
   * Initialize dark mode from localStorage and system preferences
   */
  const initializeDarkMode = () => {
    // Load saved preference
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    }

    // Apply initial theme
    updateDarkMode()

    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme.value === 'system') {
          isDark.value = e.matches
          applyTheme(isDark.value)
        }
      }

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
      }
    }
  }

  // Initialize on mount
  onMounted(() => {
    initializeDarkMode()
  })

  // Watch theme changes
  watch(theme, () => {
    updateDarkMode()
  })

  return {
    isDark,
    theme,
    setTheme,
    toggleDarkMode,
    initializeDarkMode,
  }
}
