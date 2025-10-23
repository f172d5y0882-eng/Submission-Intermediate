self.addEventListener('push', (event) => {
 let data = {};
if (event.data) {
  try {
    data = event.data.json(); // mencoba parse JSON
  } catch (e) {
    data = {
      title: 'Notifikasi',
      body: event.data.text(), // fallback jika bukan JSON
    };
  }
}


  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.body || 'Ada pesan baru dari Dicoding!',
    icon: './icons/icon-192x192.png', // ✅ relatif
    image: data.image || undefined,
    data: {
      url: data.url || './', // ✅ relatif
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

const CACHE_NAME = 'cerita-app-v1';
const urlsToCache = [
  './', // ✅ relatif
  './index.html',
  './fallback.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './manifest.json',
  './app.css', // pastikan sesuai hasil build
  './app.bundle.js' // file JS hasil webpack
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
      .catch(() => caches.match('./fallback.html')) // ✅ relatif
  );
});
