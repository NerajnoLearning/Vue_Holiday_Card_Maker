import { ref } from 'vue'

/**
 * Cache storage types
 */
export type CacheType = 'localStorage' | 'sessionStorage' | 'memory'

/**
 * Cache entry interface
 */
export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt?: number
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  type?: CacheType
  ttl?: number // Time to live in milliseconds
  prefix?: string
}

/**
 * Composable for caching strategies
 */
export const useCache = (config: CacheConfig = {}) => {
  const {
    type = 'localStorage',
    ttl = 1000 * 60 * 60, // Default 1 hour
    prefix = 'greeting-card-'
  } = config

  const isSupported = ref(false)
  const memoryCache = new Map<string, CacheEntry<unknown>>()

  /**
   * Check if storage is supported
   */
  const checkSupport = (): boolean => {
    if (type === 'memory') {
      isSupported.value = true
      return true
    }

    try {
      const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage
      const testKey = '__storage_test__'
      storage.setItem(testKey, 'test')
      storage.removeItem(testKey)
      isSupported.value = true
      return true
    } catch (e) {
      console.warn(`${type} not available, falling back to memory cache`)
      isSupported.value = false
      return false
    }
  }

  /**
   * Get storage instance
   */
  const getStorage = (): Storage | null => {
    if (!checkSupport() || type === 'memory') return null
    return type === 'localStorage' ? window.localStorage : window.sessionStorage
  }

  /**
   * Generate cache key with prefix
   */
  const getCacheKey = (key: string): string => {
    return `${prefix}${key}`
  }

  /**
   * Set cache entry
   */
  const set = <T>(key: string, data: T, customTtl?: number): boolean => {
    const cacheKey = getCacheKey(key)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: customTtl ? Date.now() + customTtl : Date.now() + ttl
    }

    try {
      const storage = getStorage()
      if (storage) {
        storage.setItem(cacheKey, JSON.stringify(entry))
      } else {
        memoryCache.set(cacheKey, entry as CacheEntry<unknown>)
      }
      return true
    } catch (e) {
      console.error('Cache set error:', e)
      // Fallback to memory cache
      memoryCache.set(cacheKey, entry as CacheEntry<unknown>)
      return false
    }
  }

  /**
   * Get cache entry
   */
  const get = <T>(key: string): T | null => {
    const cacheKey = getCacheKey(key)

    try {
      const storage = getStorage()
      let entry: CacheEntry<T> | null = null

      if (storage) {
        const item = storage.getItem(cacheKey)
        if (item) {
          entry = JSON.parse(item) as CacheEntry<T>
        }
      } else {
        entry = memoryCache.get(cacheKey) as CacheEntry<T> | undefined || null
      }

      if (!entry) return null

      // Check if expired
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        remove(key)
        return null
      }

      return entry.data
    } catch (e) {
      console.error('Cache get error:', e)
      return null
    }
  }

  /**
   * Remove cache entry
   */
  const remove = (key: string): boolean => {
    const cacheKey = getCacheKey(key)

    try {
      const storage = getStorage()
      if (storage) {
        storage.removeItem(cacheKey)
      } else {
        memoryCache.delete(cacheKey)
      }
      return true
    } catch (e) {
      console.error('Cache remove error:', e)
      return false
    }
  }

  /**
   * Clear all cache entries with prefix
   */
  const clear = (): boolean => {
    try {
      const storage = getStorage()
      if (storage) {
        const keys = Object.keys(storage)
        keys.forEach(key => {
          if (key.startsWith(prefix)) {
            storage.removeItem(key)
          }
        })
      } else {
        memoryCache.clear()
      }
      return true
    } catch (e) {
      console.error('Cache clear error:', e)
      return false
    }
  }

  /**
   * Check if key exists and is not expired
   */
  const has = (key: string): boolean => {
    return get(key) !== null
  }

  /**
   * Get cache size
   */
  const size = (): number => {
    try {
      const storage = getStorage()
      if (storage) {
        const keys = Object.keys(storage)
        return keys.filter(key => key.startsWith(prefix)).length
      } else {
        return memoryCache.size
      }
    } catch (e) {
      console.error('Cache size error:', e)
      return 0
    }
  }

  /**
   * Get all cache keys
   */
  const keys = (): string[] => {
    try {
      const storage = getStorage()
      if (storage) {
        const allKeys = Object.keys(storage)
        return allKeys
          .filter(key => key.startsWith(prefix))
          .map(key => key.replace(prefix, ''))
      } else {
        return Array.from(memoryCache.keys()).map(key => key.replace(prefix, ''))
      }
    } catch (e) {
      console.error('Cache keys error:', e)
      return []
    }
  }

  /**
   * Get cache statistics
   */
  const stats = () => {
    const cacheKeys = keys()
    let totalSize = 0
    let expiredCount = 0

    cacheKeys.forEach(key => {
      const entry = get(key)
      if (entry === null) {
        expiredCount++
      } else {
        const storage = getStorage()
        if (storage) {
          const cacheKey = getCacheKey(key)
          const item = storage.getItem(cacheKey)
          totalSize += item ? item.length : 0
        }
      }
    })

    return {
      totalEntries: cacheKeys.length,
      expiredEntries: expiredCount,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      type: isSupported.value ? type : 'memory'
    }
  }

  // Initialize
  checkSupport()

  return {
    isSupported,
    set,
    get,
    remove,
    clear,
    has,
    size,
    keys,
    stats
  }
}

/**
 * Image cache composable
 */
export const useImageCache = () => {
  const cache = useCache({
    type: 'localStorage',
    ttl: 1000 * 60 * 60 * 24 * 7, // 7 days
    prefix: 'greeting-card-image-'
  })

  /**
   * Cache image as base64
   */
  const cacheImage = async (url: string): Promise<string | null> => {
    // Check if already cached
    const cached = cache.get<string>(url)
    if (cached) return cached

    try {
      const response = await fetch(url)
      const blob = await response.blob()

      return new Promise<string | null>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          cache.set(url, base64)
          resolve(base64)
        }
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    } catch (e) {
      console.error('Image cache error:', e)
      return null
    }
  }

  /**
   * Get cached image
   */
  const getCachedImage = (url: string): string | null => {
    return cache.get<string>(url)
  }

  return {
    cacheImage,
    getCachedImage,
    clearImageCache: cache.clear,
    imageStats: cache.stats
  }
}

/**
 * Template cache composable
 */
export const useTemplateCache = () => {
  const cache = useCache({
    type: 'sessionStorage',
    ttl: 1000 * 60 * 30, // 30 minutes
    prefix: 'greeting-card-template-'
  })

  return {
    cacheTemplate: cache.set,
    getTemplate: cache.get,
    clearTemplates: cache.clear
  }
}
