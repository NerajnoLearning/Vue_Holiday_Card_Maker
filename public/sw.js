const CACHE_NAME = 'greeting-card-v1'
const RUNTIME_CACHE = 'greeting-card-runtime-v1'

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/templates/backgrounds/christmas-bg.jpg',
  '/assets/templates/backgrounds/newyear-bg.jpg',
  '/assets/templates/backgrounds/valentine-bg.jpg',
  '/assets/templates/backgrounds/birthday-bg.jpg',
  '/assets/templates/thumbnails/christmas-thumb.jpg',
  '/assets/templates/thumbnails/newyear-thumb.jpg',
  '/assets/templates/thumbnails/valentine-thumb.jpg',
  '/assets/templates/thumbnails/birthday-thumb.jpg'
]

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching assets')
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle navigation requests (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // Handle static assets
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url)
            return cachedResponse
          }

          return fetch(request)
            .then(response => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200) {
                return response
              }

              const responseToCache = response.clone()
              caches.open(RUNTIME_CACHE)
                .then(cache => {
                  console.log('[SW] Caching new resource:', request.url)
                  cache.put(request, responseToCache)
                })

              return response
            })
        })
    )
    return
  }

  // For all other requests, network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseToCache = response.clone()
        caches.open(RUNTIME_CACHE)
          .then(cache => cache.put(request, responseToCache))
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(name => caches.delete(name))
          )
        })
        .then(() => {
          event.ports[0].postMessage({ type: 'CACHE_CLEARED' })
        })
    )
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(name =>
              caches.open(name)
                .then(cache => cache.keys())
            )
          )
        })
        .then(allKeys => {
          const totalItems = allKeys.flat().length
          event.ports[0].postMessage({
            type: 'CACHE_SIZE',
            size: totalItems
          })
        })
    )
  }
})
