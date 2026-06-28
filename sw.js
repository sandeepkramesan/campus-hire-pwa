// Campus Hire — Service Worker v2
const CACHE = 'campus-hire-v2';
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
];

// ── Install: pre-cache CDN assets ────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(CDN_ASSETS.map(url =>
        c.add(url).catch(() => console.warn('[SW] Skipped:', url))
      ))
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: clear old caches ───────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for CDN, network-first for app ─
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;
  const isCDN = url.includes('cdnjs.cloudflare.com') || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');

  if (isCDN) {
    // Cache-first: serve from cache, update in background
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        });
      })
    );
  } else {
    // Network-first: try fresh, fall back to cache
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
