
const CACHE_NAME = 'aether-v2-premium';
const STATIC_ASSETS = [
  './',
  './index.html',
  './vite.svg',
  './manifest.json'
];

// Domains that should be cached aggressively (Libraries, Fonts, Styles)
const EXTERNAL_DOMAINS = [
  'aistudiocdn.com',
  'unpkg.com',
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache the app shell
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Strategy 1: External Dependencies (Cache First, fall back to Network)
  // This ensures React, Three.js, etc. load instantly and work offline
  if (EXTERNAL_DOMAINS.some(domain => url.hostname.includes(domain))) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(e.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'cors' && response.type !== 'basic' && response.type !== 'opaque') {
            return response;
          }

          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Strategy 2: App Shell & Local Files (Stale-While-Revalidate)
  // Serve from cache immediately, but update cache in background
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
           const responseToCache = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => {
             cache.put(e.request, responseToCache);
           });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback logic could go here
      });

      return cachedResponse || fetchPromise;
    })
  );
});
