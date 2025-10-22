import FavoriteDB from '../../data/favorite-db';

class FavoritePage {
  async render() {
    return `
      <section class="container">
        <h2>Cerita Favorit</h2>
        <div id="fav-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await FavoriteDB.getAll();
    const container = document.querySelector('#fav-list');

    if (stories.length === 0) {
      container.innerHTML = '<p>Belum ada cerita favorit.</p>';
      return;
    }

    stories.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" width="100">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button class="remove-fav" data-id="${story.id}">Hapus</button>
      `;
      container.appendChild(item);
    });

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('remove-fav')) {
        const id = e.target.dataset.id;
        await FavoriteDB.delete(id);
        alert('Cerita dihapus dari favorit.');
        this.afterRender(); // re-render
      }
    });
  }
}

export default FavoritePage;
