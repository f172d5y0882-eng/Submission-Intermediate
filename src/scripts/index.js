import '../styles/styles.css';
import App from './pages/app';
import Header from './components/header';

const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Helper untuk convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function initPushNotification() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // ✅ Daftarkan Service Worker
      await navigator.serviceWorker.register('sw.js');

      // ✅ Tunggu sampai SW siap
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker siap digunakan');

      // ✅ Minta izin notifikasi
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('❌ Izin notifikasi ditolak');
        return;
      }

      // ✅ Buat subscription
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      };

      // Hapus subscription lama jika ada
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
        console.log('🔄 Subscription lama dihapus');
      }

      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);

      // ✅ Sesuai dokumentasi Dicoding, hapus expirationTime
      const raw = pushSubscription.toJSON();
      const cleanSubscription = {
        endpoint: raw.endpoint,
        keys: {
          p256dh: raw.keys.p256dh,
          auth: raw.keys.auth,
        },
      };

      console.log('✅ Berhasil subscribe push', cleanSubscription);

      // ✅ Kirim ke API Dicoding hanya di production
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      if (!isLocalhost) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cleanSubscription),
          });

          const result = await response.json();
          if (!result.error) {
            console.log('✅ Subscription berhasil dikirim ke server');
          } else {
            console.error('❌ Gagal kirim subscription:', result.message);
          }
        } catch (error) {
          console.warn('⚠️ Tidak bisa mengirim subscription ke API (kemungkinan CORS)', error);
        }
      } else {
        console.warn('🚫 Lewati pengiriman push subscription saat di localhost');
      }
    } catch (error) {
      console.error('❌ Push init error:', error);
    }
  } else {
    console.warn('🚫 Push Notification tidak didukung browser');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // ✅ CLEAR SERVICE WORKER & CACHE SAAT LOCAL DEV
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    navigator.serviceWorker.getRegistrations?.().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
    caches?.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
    console.log('🧹 Localhost: SW & cache dibersihkan');
  }

  // 🔹 Render Header lebih dulu
  const headerContainer = document.querySelector('header');
  const header = new Header();
  headerContainer.innerHTML = await header.render();
  await header.afterRender();

  // 🔹 Ambil elemen navigasi
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');

  if (!drawerButton || !navigationDrawer) {
    console.error('❌ drawerButton atau navigationDrawer tidak ditemukan!');
    return;
  }

  // 🔹 Inisialisasi App
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton,
    navigationDrawer,
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // 🔹 Init Push Notification
  await initPushNotification();
});
