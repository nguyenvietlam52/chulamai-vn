const CACHE = 'xuatben-v5';
const ASSETS = [
  './', './index.html', './app.js',
  './vendor/jszip.min.js', './vendor/jsQR.js',
  './vendor/tesseract.min.js', './vendor/worker.min.js',
  './vendor/tesseract-core-simd-lstm.wasm.js', './vendor/tesseract-core-lstm.wasm.js',
  './vendor/vie.traineddata.gz',
  './assets/template.xlsx', './manifest.webmanifest'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // ocr-config.json: LUÔN lấy mạng (không cache) để app tự lành khi URL tunnel đổi.
  if (e.request.url.includes('ocr-config.json')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    if (resp && resp.ok && resp.status === 200) {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
    }
    return resp;
  }).catch(() => caches.match('./index.html'))));
});
