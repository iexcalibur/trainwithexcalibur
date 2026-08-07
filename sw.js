/* Training Week PWA — offline-first service worker */
const CACHE = 'twpwa-v7';
const MEDIA = 'twpwa-media-v1';
const DEMO_HOST = 'cdn.jsdelivr.net';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'plan.js',
  'sakshi-plan.js',
  'bodymodel.js',
  'exdemo.js',
  'exinfo.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== MEDIA).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  /* Demo frames from the CDN: cache-first, so a movement you've viewed
     once keeps working offline at the gym. */
  if (url.hostname === DEMO_HOST) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(MEDIA).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit))
    );
    return;
  }

  /* Same-origin: stale-while-revalidate so updates land on next visit. */
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
