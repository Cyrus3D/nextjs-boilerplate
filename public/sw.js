// Service Worker for Hot Thai
const CACHE_NAME = "hot-thai-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  // Add other static assets as needed
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline response
            return new Response(JSON.stringify({ error: "Network unavailable", offline: true }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
          })
        }),
    )
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch((error) => {
            // Return offline fallback if available
            if (url.pathname === "/") {
              return caches.match("/")
            }
            return new Response("Offline", { status: 503 })
          })
      )
    }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "view-count-sync") {
    event.waitUntil(syncViewCounts())
  }
})

// Helper function to sync view counts
async function syncViewCounts() {
  try {
    // Get offline view counts from localStorage
    const clients = await self.clients.matchAll()
    if (clients.length > 0) {
      const client = clients[0]
      client.postMessage({ type: "SYNC_VIEW_COUNTS" })
    }
  } catch (error) {
    console.error("[SW] Failed to sync view counts:", error)
  }
}

// Message handling
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

console.log("[SW] Service worker loaded")
