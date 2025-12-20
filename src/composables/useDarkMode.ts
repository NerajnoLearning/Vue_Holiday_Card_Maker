import { ref, watch, onMounted, type Ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'greeting-card-maker-theme'

// Create shared state singleton
const createSharedState = () => {
  return {
    isDark: ref(false),
    theme: ref<Theme>('system'),
    initialized: ref(false)
  }
}

let sharedState: ReturnType<typeof createSharedState> | null = null

const getSharedState = () => {
  if (!sharedState) {
    sharedState = createSharedState()
  }
  return sharedState
}

export const useDarkMode = () => {
  const { isDark, theme, initialized } = getSharedState()
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
  const applyTheme = (shouldBeDark: boolean) => {
    if (typeof document === 'undefined') return

    console.log('Applying theme. shouldBeDark:', shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to html element')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from html element')
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
    console.log('Toggle clicked! Current isDark:', isDark.value)
    if (isDark.value) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
    console.log('After toggle, isDark:', isDark.value, 'theme:', theme.value)
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

  // Initialize on mount (only once for the first component)
  onMounted(() => {
    if (!initialized.value) {
      initialized.value = true
      initializeDarkMode()
    }
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
