class LoginPage {
  async render() {
    return `
      <section class="container">
        <h2>Login</h2>
        <form id="login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Login</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;

      try {
        const res = await import('../../data/api.js');
        const result = await res.loginUser(email, password);

        if (!result.error) {
          alert('Login berhasil!');
          location.hash = '#/';
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert('Terjadi kesalahan saat login');
        console.error(err);
      }
    });
  }
}

export default LoginPage;
