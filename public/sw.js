const CACHE_NAME = "stokr-pwa-v3"
const ICON_CACHE_NAME = `${CACHE_NAME}-icons`

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ICON_CACHE_NAME)
  )

  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== ICON_CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  )

  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== "GET") return

  if (url.origin !== self.location.origin) return

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/pricing") ||
    url.pathname.startsWith("/watchlist") ||
    url.pathname.startsWith("/stocks/") ||
    url.pathname.startsWith("/offline")
  ) {
    return
  }

  if (url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.open(ICON_CACHE_NAME).then((cache) => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
        })
      })
    )
  }
})
