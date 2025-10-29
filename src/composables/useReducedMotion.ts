import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export const useReducedMotion = () => {
  const prefersReducedMotion = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const updatePreference = (event?: MediaQueryListEvent | MediaQueryList) => {
    if (event) {
      prefersReducedMotion.value = event.matches
    }
  }

  onMounted(() => {
    // Check if window and matchMedia are available
    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      // Set initial value
      prefersReducedMotion.value = mediaQuery.matches

      // Listen for changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updatePreference)
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(updatePreference)
      }
    }
  })

  onUnmounted(() => {
    // Clean up listener
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePreference)
      } else if (mediaQuery.removeListener) {
        // Fallback for older browsers
        mediaQuery.removeListener(updatePreference)
      }
    }
  })

  return {
    prefersReducedMotion
  }
}
