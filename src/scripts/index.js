import '../styles/styles.css';
import App from './pages/app';
import Header from './components/header';

const vapidPublicKey = 'BMK6wYvdWg2EtZ-VoKOyM54TbMQUncw8csZ7ZAr8g0aS9_qJqt2lh7ydazrErvS-RLKybzyE3ToHzT_KND5QkL4';

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
      // ✅ Daftarkan SW
      await navigator.serviceWorker.register('sw.js');

      // ✅ Tunggu sampai SW aktif
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

      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);

      // Hapus expirationTime karena Dicoding API tidak izinkan field ini
      const raw = pushSubscription.toJSON();
      const cleanSubscription = {
        endpoint: raw.endpoint,
        keys: raw.keys,
      };

      console.log('✅ Berhasil subscribe push', cleanSubscription);

      // ✅ Cek apakah localhost atau production
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

      if (!isLocalhost) {
        try {
          const token = localStorage.getItem('authToken'); // ambil token dari login

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
