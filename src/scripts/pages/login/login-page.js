import Swal from 'sweetalert2';

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
        // tampilkan loading indicator
        Swal.fire({
          title: 'Sedang login...',
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const res = await import('../../data/api.js');
        const result = await res.loginUser(email, password);

        if (!result.error) {
          Swal.fire({
            icon: 'success',
            title: 'Login berhasil!',
            text: `Selamat datang kembali, ${email}`,
          }).then(() => {
            location.hash = '#/';
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login gagal',
            text: result.message,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Tidak dapat melakukan login. Silakan coba lagi.',
        });
        console.error(err);
      }
    });
  }
}

export default LoginPage;
