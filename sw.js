const CACHE_NAME = 'pd-calc-v1.1.5';
const LEGACY_CACHE_TO_AUTO_UPGRADE = 'pd-calc-v1.1.4';
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=1.1.5',
  './js/data.js?v=1.1.5',
  './js/calc.js?v=1.1.5',
  './js/ui.js?v=1.1.5',
  './manifest.json?v=1.1.5',
  './icons/icon-192.png?v=1.1.5',
  './icons/icon-512.png?v=1.1.5'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    await caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS));
    const keys = await caches.keys();

    // One-time bridge: v1.1.3 used a cache-clearing refresh button that could mix asset versions.
    // Activate v1.1.5 immediately only when upgrading from that affected cache.
    if (keys.includes(LEGACY_CACHE_TO_AUTO_UPGRADE)) {
      await self.skipWaiting();
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keysBeforeCleanup = await caches.keys();
    const legacyClientPresent = keysBeforeCleanup.includes(LEGACY_CACHE_TO_AUTO_UPGRADE);

    await Promise.all(keysBeforeCleanup.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();

    // Refresh legacy v1.1.3 clients once. Future versions use the Update now banner.
    if (legacyClientPresent) {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      await Promise.all(windows.map(client => client.navigate(client.url)));
    }
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
