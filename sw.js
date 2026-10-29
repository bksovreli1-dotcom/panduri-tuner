const CACHE = 'panduri-offline-v6';
const FILES = ['./', './index.html', './style.css', './pitch.js', './app.js', './songs.js', './chords.js', './offline.js'];
const urls = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('panduri-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  url.hash = '';
  if (event.request.method !== 'GET' || !urls.has(url.href)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const saved = await cache.match(event.request);
    return saved || fetch(event.request);
  }));
});
