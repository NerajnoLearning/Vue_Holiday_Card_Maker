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

  let refreshing = false

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

    try {
      status.value = 'installing'
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      registration.value = reg

      console.log('[SW] Service Worker registered:', reg.scope)

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New version available')
            updateAvailable.value = true
            status.value = 'waiting'
          } else if (newWorker.state === 'activated') {
            console.log('[SW] Service Worker activated')
            status.value = 'active'
          }
        })
      })

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

    // Reload page when new worker activates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  }

  /**
   * Clear all caches
   */
  const clearCache = async (): Promise<void> => {
    if (!registration.value?.active) return

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          console.log('[SW] Cache cleared')
          resolve()
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

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          console.log('[SW] Cache size:', event.data.size)
          resolve(event.data.size)
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
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
  })

  return { isPWA }
}
