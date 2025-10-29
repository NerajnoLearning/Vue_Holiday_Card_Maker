import { ref, computed, onMounted } from 'vue'

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  loadTime?: number // Page load time
}

/**
 * Composable for performance monitoring
 */
export const usePerformance = () => {
  const metrics = ref<PerformanceMetrics>({})
  const isSupported = ref(false)

  /**
   * Check if Performance API is supported
   */
  const checkSupport = () => {
    isSupported.value = 'performance' in window && 'PerformanceObserver' in window
  }

  /**
   * Measure First Contentful Paint (FCP)
   */
  const measureFCP = () => {
    try {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        metrics.value.fcp = Math.round(fcpEntry.startTime)
      }
    } catch (error) {
      console.warn('Failed to measure FCP:', error)
    }
  }

  /**
   * Measure Largest Contentful Paint (LCP)
   */
  const measureLCP = () => {
    try {
      if (!('PerformanceObserver' in window)) return

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
        metrics.value.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime)
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('Failed to measure LCP:', error)
    }
  }

  /**
   * Measure First Input Delay (FID)
   */
  const measureFID = () => {
    try {
      if (!('PerformanceObserver' in window)) return

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number }
          if (fidEntry.processingStart) {
            metrics.value.fid = Math.round(fidEntry.processingStart - entry.startTime)
          }
        })
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('Failed to measure FID:', error)
    }
  }

  /**
   * Measure Cumulative Layout Shift (CLS)
   */
  const measureCLS = () => {
    try {
      if (!('PerformanceObserver' in window)) return

      let clsValue = 0

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value
            metrics.value.cls = Math.round(clsValue * 1000) / 1000
          }
        })
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('Failed to measure CLS:', error)
    }
  }

  /**
   * Measure Time to First Byte (TTFB)
   */
  const measureTTFB = () => {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        metrics.value.ttfb = Math.round(navigationEntry.responseStart - navigationEntry.requestStart)
      }
    } catch (error) {
      console.warn('Failed to measure TTFB:', error)
    }
  }

  /**
   * Measure page load time
   */
  const measureLoadTime = () => {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        metrics.value.loadTime = Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart)
      }
    } catch (error) {
      console.warn('Failed to measure load time:', error)
    }
  }

  /**
   * Log performance metrics
   */
  const logMetrics = () => {
    if (import.meta.env.DEV) {
      console.group('⚡ Performance Metrics')
      console.table(metrics.value)
      console.groupEnd()
    }
  }

  /**
   * Get performance grade
   */
  const getPerformanceGrade = computed(() => {
    const { fcp, lcp, fid, cls } = metrics.value

    // Good thresholds
    const goodFCP = 1800 // ms
    const goodLCP = 2500 // ms
    const goodFID = 100 // ms
    const goodCLS = 0.1

    let score = 0
    let total = 0

    if (fcp !== undefined) {
      score += fcp <= goodFCP ? 1 : 0
      total++
    }
    if (lcp !== undefined) {
      score += lcp <= goodLCP ? 1 : 0
      total++
    }
    if (fid !== undefined) {
      score += fid <= goodFID ? 1 : 0
      total++
    }
    if (cls !== undefined) {
      score += cls <= goodCLS ? 1 : 0
      total++
    }

    const percentage = total > 0 ? (score / total) * 100 : 0

    if (percentage >= 75) return 'Good'
    if (percentage >= 50) return 'Needs Improvement'
    return 'Poor'
  })

  /**
   * Initialize performance monitoring
   */
  const init = () => {
    checkSupport()

    if (!isSupported.value) {
      console.warn('Performance API not supported')
      return
    }

    // Measure core web vitals
    measureFCP()
    measureLCP()
    measureFID()
    measureCLS()
    measureTTFB()

    // Measure load time after page load
    if (document.readyState === 'complete') {
      measureLoadTime()
    } else {
      window.addEventListener('load', measureLoadTime)
    }

    // Log metrics after 3 seconds
    setTimeout(logMetrics, 3000)
  }

  onMounted(() => {
    init()
  })

  return {
    metrics,
    isSupported,
    getPerformanceGrade,
    logMetrics
  }
}

/**
 * Measure component render time
 */
export const useMeasureRender = (componentName: string) => {
  const startTime = performance.now()

  const endMeasure = () => {
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    if (import.meta.env.DEV) {
      console.log(`🎨 ${componentName} rendered in ${duration}ms`)
    }

    return duration
  }

  return {
    startTime,
    endMeasure
  }
}
