import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for accessibility utilities
 */
export const useA11y = () => {
  /**
   * Announce message to screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return {
    announce
  }
}

/**
 * Composable for keyboard navigation
 */
export const useKeyboardNav = (handlers: {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
}) => {
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        handlers.onEscape?.()
        break
      case 'Enter':
        handlers.onEnter?.()
        break
      case 'ArrowUp':
        event.preventDefault()
        handlers.onArrowUp?.()
        break
      case 'ArrowDown':
        event.preventDefault()
        handlers.onArrowDown?.()
        break
      case 'ArrowLeft':
        handlers.onArrowLeft?.()
        break
      case 'ArrowRight':
        handlers.onArrowRight?.()
        break
      case 'Tab':
        handlers.onTab?.()
        break
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    handleKeydown
  }
}

/**
 * Composable for focus management
 */
export const useFocusTrap = (containerRef: HTMLElement | null) => {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef) return []
    return Array.from(containerRef.querySelectorAll(focusableElements))
  }

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const elements = getFocusableElements()
    if (elements.length === 0) return

    const firstElement = elements[0]
    const lastElement = elements[elements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const focusFirst = () => {
    const elements = getFocusableElements()
    if (elements.length > 0) {
      elements[0].focus()
    }
  }

  return {
    trapFocus,
    focusFirst,
    getFocusableElements
  }
}

/**
 * Generate unique ID for accessibility labels
 */
let idCounter = 0
export const useId = (prefix = 'a11y'): string => {
  return `${prefix}-${++idCounter}`
}

/**
 * Detect high contrast mode
 */
export const useHighContrast = () => {
  const isHighContrast = ref(false)

  const checkHighContrast = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Check for Windows High Contrast Mode
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
      isHighContrast.value = highContrastQuery.matches
    }
  }

  onMounted(() => {
    checkHighContrast()

    if (window.matchMedia) {
      const query = window.matchMedia('(prefers-contrast: high)')
      const handler = () => checkHighContrast()

      if (query.addEventListener) {
        query.addEventListener('change', handler)
      }

      onUnmounted(() => {
        if (query.removeEventListener) {
          query.removeEventListener('change', handler)
        }
      })
    }
  })

  return {
    isHighContrast
  }
}
