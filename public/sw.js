const CACHE_NAME = "stokr-pwa-v1"

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )

  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  )

  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== "GET") {
    return
  }

  if (url.pathname.startsWith("/api/")) {
    return
  }

  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/watchlist") ||
    url.pathname.startsWith("/pricing") ||
    url.pathname.startsWith("/stocks/")
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline"))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).catch(() => caches.match("/offline"))
    })
  )
})