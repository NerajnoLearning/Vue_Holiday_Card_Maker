import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Service worker status
 */
export type ServiceWorkerStatus =
  | 'unsupported'
  | 'installing'
  | 'waiting'
  | 'active'
  | 'error'

/**
 * Composable for service worker management
 */
export const useServiceWorker = () => {
  const status = ref<ServiceWorkerStatus>('unsupported')
  const isSupported = ref(false)
  const registration = ref<ServiceWorkerRegistration | null>(null)
  const updateAvailable = ref(false)
  const error = ref<string | null>(null)

  const refreshing = ref(false)
  let controllerChangeListener: (() => void) | null = null
  let updateFoundListener: (() => void) | null = null
  let stateChangeListener: (() => void) | null = null

  /**
   * Check if service workers are supported
   */
  const checkSupport = (): boolean => {
    isSupported.value = 'serviceWorker' in navigator
    return isSupported.value
  }

  /**
   * Register service worker
   */
  const register = async () => {
    if (!checkSupport()) {
      console.log('[SW] Service Workers not supported')
      status.value = 'unsupported'
      return null
    }

    // Only register in production
    if (import.meta.env.DEV) {
      console.log('[SW] Skipping registration in development mode')
      return null
    }

    // Prevent duplicate registration
    if (registration.value) {
      console.log('[SW] Service Worker already registered')
      return registration.value
    }

    try {
      status.value = 'installing'
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      registration.value = reg

      console.log('[SW] Service Worker registered:', reg.scope)

      // Check for updates
      updateFoundListener = () => {
        const newWorker = reg.installing
        if (!newWorker) return

        stateChangeListener = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New version available')
            updateAvailable.value = true
            status.value = 'waiting'
          } else if (newWorker.state === 'activated') {
            console.log('[SW] Service Worker activated')
            status.value = 'active'
          }
        }
        newWorker.addEventListener('statechange', stateChangeListener)
      }
      reg.addEventListener('updatefound', updateFoundListener)

      // Check initial state
      if (reg.active) {
        status.value = 'active'
      } else if (reg.waiting) {
        status.value = 'waiting'
        updateAvailable.value = true
      } else if (reg.installing) {
        status.value = 'installing'
      }

      return reg
    } catch (e) {
      console.error('[SW] Registration failed:', e)
      error.value = e instanceof Error ? e.message : 'Registration failed'
      status.value = 'error'
      return null
    }
  }

  /**
   * Unregister service worker
   */
  const unregister = async (): Promise<boolean> => {
    if (!registration.value) return false

    try {
      const result = await registration.value.unregister()
      console.log('[SW] Service Worker unregistered')
      registration.value = null
      status.value = 'unsupported'
      return result
    } catch (e) {
      console.error('[SW] Unregistration failed:', e)
      return false
    }
  }

  /**
   * Update service worker
   */
  const update = async (): Promise<void> => {
    if (!registration.value) return

    try {
      await registration.value.update()
      console.log('[SW] Checking for updates')
    } catch (e) {
      console.error('[SW] Update check failed:', e)
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  const skipWaiting = () => {
    if (!registration.value?.waiting) return

    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })

    // Clean up previous listener if it exists
    if (controllerChangeListener) {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeListener)
    }

    // Reload page when new worker activates
    controllerChangeListener = () => {
      if (refreshing.value) return
      refreshing.value = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeListener)
  }

  /**
   * Clear all caches
   */
  const clearCache = async (): Promise<void> => {
    if (!registration.value?.active) return

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel()
      const TIMEOUT_MS = 5000

      const timeout = setTimeout(() => {
        messageChannel.port1.close()
        reject(new Error('Cache clear operation timed out'))
      }, TIMEOUT_MS)

      messageChannel.port1.onmessage = (event) => {
        clearTimeout(timeout)
        if (event.data.type === 'CACHE_CLEARED') {
          console.log('[SW] Cache cleared')
          messageChannel.port1.close()
          resolve()
        } else {
          messageChannel.port1.close()
          reject(new Error('Unexpected response from service worker'))
        }
      }

      registration.value!.active!.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      )
    })
  }

  /**
   * Get cache size
   */
  const getCacheSize = async (): Promise<number> => {
    if (!registration.value?.active) return 0

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel()
      const TIMEOUT_MS = 5000

      const timeout = setTimeout(() => {
        messageChannel.port1.close()
        reject(new Error('Get cache size operation timed out'))
      }, TIMEOUT_MS)

      messageChannel.port1.onmessage = (event) => {
        clearTimeout(timeout)
        if (event.data.type === 'CACHE_SIZE') {
          console.log('[SW] Cache size:', event.data.size)
          messageChannel.port1.close()
          resolve(event.data.size)
        } else {
          messageChannel.port1.close()
          reject(new Error('Unexpected response from service worker'))
        }
      }

      registration.value!.active!.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      )
    })
  }

  /**
   * Check if running from cache (offline)
   */
  const isOffline = ref(!navigator.onLine)

  const updateOnlineStatus = () => {
    isOffline.value = !navigator.onLine
  }

  onMounted(() => {
    // Auto-register on mount
    register()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)

    // Clean up service worker event listeners
    if (controllerChangeListener) {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeListener)
    }
    if (registration.value && updateFoundListener) {
      registration.value.removeEventListener('updatefound', updateFoundListener)
    }
    // Note: stateChangeListener is attached to a Worker instance that may be garbage collected
    // In a production app, you might want to track the worker instance to clean it up
  })

  return {
    status,
    isSupported,
    registration,
    updateAvailable,
    error,
    isOffline,
    register,
    unregister,
    update,
    skipWaiting,
    clearCache,
    getCacheSize
  }
}

/**
 * Detect if app is installed as PWA
 */
export const useIsPWA = () => {
  const isPWA = ref(false)

  onMounted(() => {
    isPWA.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && window.navigator.standalone === true) ||
      document.referrer.includes('android-app://')
  })

  return { isPWA }
}
