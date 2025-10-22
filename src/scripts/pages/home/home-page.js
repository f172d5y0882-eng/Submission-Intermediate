import { getStories } from '../../data/api';

class HomePage {
  async render() {
    return `
      <section class="container">
        <h2>Daftar Cerita</h2>
        <div id="map" style="height: 400px; margin-block: 20px;"></div>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const storyListContainer = document.querySelector('#story-list');
    const map = L.map('map').setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const token = localStorage.getItem('authToken');
    if (!token) {
      storyListContainer.innerHTML = `
        <p>Silakan <a href="#/login">login</a> untuk melihat daftar cerita.</p>
      `;
      return;
    }

    try {
      const response = await getStories();
      const stories = response.listStory || [];

      if (stories.length === 0) {
        storyListContainer.innerHTML = '<p>Tidak ada cerita tersedia.</p>';
        return;
      }

      stories.forEach((story) => {
        const { id, name, description, photoUrl, lat, lon } = story;

        const storyItem = document.createElement('article');
        storyItem.classList.add('story-item');
        storyItem.innerHTML = `
          <img src="${photoUrl}" alt="${name}" width="100">
          <h3>${name}</h3>
          <p>${description}</p>
          <small>Lokasi: (${lat}, ${lon})</small><br>
          <button class="fav-btn" 
            data-id="${id}" 
            data-name="${name}" 
            data-description="${description}" 
            data-photo="${photoUrl}">
            ❤️ Favorite
          </button>
        `;
        storyListContainer.appendChild(storyItem);

        if (lat && lon) {
          const marker = L.marker([lat, lon]).addTo(map);
          marker.bindPopup(`<b>${name}</b><br>${description}`);
        }
      });

      // Tambahkan listener untuk tombol favorite
      storyListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('fav-btn')) {
          const button = e.target;
          const story = {
            id: button.dataset.id,
            name: button.dataset.name,
            description: button.dataset.description,
            photoUrl: button.dataset.photo,
          };

          const FavoriteDB = (await import('../../data/favorite-db.js')).default;
          await FavoriteDB.put(story);
          alert('Berhasil ditambahkan ke Favorite!');
        }
      });

    } catch (err) {
      console.error(err);
      storyListContainer.innerHTML = '<p>Gagal memuat cerita.</p>';
    }
  }
}

export default HomePage;
