// ==============================
// PUSH NOTIFICATION HANDLER
// ==============================
self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json(); // Parsing JSON dari server
    } catch (e) {
      console.error('❌ Gagal parse push data:', e);
    }
  }

  // API Dicoding mengirim dengan schema: { title, options: { body } }
  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.options?.body || 'Ada pesan baru dari Dicoding!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-192x192.png',
    data: {
      url: data.options?.url || './',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Klik notifikasi buka halaman
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './')
  );
});

// ==============================
// CACHE STRATEGY
// ==============================
const CACHE_NAME = 'cerita-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './fallback.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './manifest.json',
  './app.css',
  './app.bundle.js',
];

// Install service worker & cache aset
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error('❌ Cache gagal:', err))
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch dengan fallback offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match('./fallback.html'))
  );
});
