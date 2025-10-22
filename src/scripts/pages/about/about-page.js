class AboutPage {
  async render() {
    return `
      <section class="container">
        <h2>Tentang Penulis</h2>
        <article class="about">
          <img src="images/foto-penulis.jpg" alt="Foto Penulis" class="about__image" />
          <div class="about__content">
            <h3>James William Saragih</h3>
            <p>Saya adalah seorang pengembang web pemula yang sedang belajar membangun aplikasi menggunakan JavaScript, Web API, dan konsep SPA (Single Page Application).</p>
            <p>Aplikasi ini dibuat sebagai bagian dari submission kelas Belajar Membuat Aplikasi Web dengan ES6 dari Dicoding.</p>
            <p>Tujuan saya membuat aplikasi ini adalah untuk membantu pengguna berbagi cerita dari berbagai lokasi di Indonesia, sekaligus melatih kemampuan menggunakan peta digital dan API.</p>
          </div>
        </article>
      </section>
    `;
  }

  async afterRender() {
    // Tidak ada logic tambahan
  }
}

export default AboutPage;
