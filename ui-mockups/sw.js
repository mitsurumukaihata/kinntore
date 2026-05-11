// kinntore PWA service worker
const VERSION = 'v61';
const CACHE = `kinntore-${VERSION}`;
const PRECACHE = [
  './',
  'home.html',
  'pattern-i.html',
  'record.html',
  'progress.html',
  'part-progress.html',
  'settings.html',
  'achievements.html',
  'dialogue.js',
  'manifest.json',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/bachiluck-logo.png',
  'img/bachiluck-logo-mark.png',
  'img/bachiluck-mark.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // API は常にネット (kinntore-api)
  if (url.hostname.includes('kinntore-api')) return;
  // 同一オリジンのみキャッシュ
  if (url.origin !== location.origin) return;

  // network-first for HTML, cache-first for assets
  const isHTML = req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('home.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }))
    );
  }
});
