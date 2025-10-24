self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json(); // parsing JSON dari server
    } catch (e) {
      console.error('❌ Gagal parse push data:', e);
    }
  }

  // Ambil title & options sesuai schema JSON Dicoding
  const title = data.title || 'Notifikasi Baru';
  const options = data.options || {
    body: 'Ada pesan baru dari Dicoding!',
    icon: './icons/icon-192x192.png',
    data: {
      url: './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './')
  );
});

const CACHE_NAME = 'cerita-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './fallback.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './manifest.json',
  './app.css',
  './app.bundle.js'
];

// Install service worker
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

// Fetch offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match('./fallback.html'))
  );
});
