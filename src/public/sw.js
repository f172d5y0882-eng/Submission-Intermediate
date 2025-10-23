self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json(); // kalau JSON valid
    } catch (e) {
      // kalau bukan JSON, ambil sebagai text biasa
      data = { 
        title: 'Notifikasi',
        body: event.data.text() // ⚠️ ini harus di-handle async
      };
    }
  }

  const showNotification = async () => {
    let body = data.body;
    if (body instanceof Promise) {
      body = await body; // resolve promise
    }

    const title = data.title || 'Notifikasi Baru';
    const options = {
      body: body || 'Ada pesan baru dari Dicoding!',
      icon: './icons/icon-192x192.png',
      data: {
        url: data.url || './'
      }
    };

    return self.registration.showNotification(title, options);
  };

  event.waitUntil(showNotification());
});
