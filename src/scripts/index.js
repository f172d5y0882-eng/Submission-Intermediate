import '../styles/styles.css';
import App from './pages/app';
import Header from './components/header';

const vapidPublicKey = 'BMK6wYvdWg2EtZ-VoKOyM54TbMQUncw8csZ7ZAr8g0aS9_qJqt2lh7ydazrErvS-RLKybzyE3ToHzT_KND5QkL4';


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function initPushNotification() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker terdaftar');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('❌ Izin notifikasi ditolak');
        return;
      }

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      };

      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('✅ Berhasil subscribe push', JSON.stringify(pushSubscription));

      // 💡 Cek apakah kita sedang di localhost
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

      if (!isLocalhost) {
        // Kirim ke API hanya jika di production
        const response = await fetch('https://story-api.dicoding.dev/v1/push/subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(pushSubscription),
        });

        const result = await response.json();
        if (!result.error) {
          console.log('✅ Subscription berhasil dikirim ke server');
        } else {
          console.error('❌ Gagal kirim subscription:', result.message);
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

  // 🔹 Tunggu elemen header muncul di DOM
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');

  if (!drawerButton || !navigationDrawer) {
    console.error('❌ drawerButton atau navigationDrawer tidak ditemukan!');
    return;
  }

  // 🔹 Inisialisasi App setelah elemen tersedia
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton,
    navigationDrawer,
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  await initPushNotification(); 
});


