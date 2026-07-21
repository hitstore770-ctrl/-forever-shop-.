// Yeshivat HaMelech HaMoshiach — offline service worker.
// Hand-written (no build-tool plugin) so it's robust across Next.js/Turbopack
// versions. Strategy:
//   • navigations (pages): network-first, fall back to the cached page, then
//     to an offline page — so once a student has opened /join (schedule) or
//     /learning (kuntresim) online, they stay available with no signal.
//   • static assets (_next/static, icons, fonts, images): cache-first.
//   • /api/* and cross-origin (Firebase): always network (never cached).
const CACHE = "ymm-cache-v1";
const OFFLINE_URL = "/offline";
const PRECACHE = ["/offline", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Firebase, external images, etc.
  if (url.pathname.startsWith("/api/")) return; // live data (zmanim, sessions) — always network.

  // Page navigations: network-first, then cache, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))),
    );
    return;
  }

  // Static assets: cache-first, populating the cache on first fetch.
  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
  }
});
