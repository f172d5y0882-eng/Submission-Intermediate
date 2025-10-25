import { registerUser } from '../../data/api';
import Swal from 'sweetalert2';

class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required minlength="8" />

          <button type="submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      try {
        const result = await registerUser(name, email, password);

        if (!result.error) {
          Swal.fire('Sukses!', 'Registrasi berhasil, silakan login!', 'success');
          location.hash = '#/login';
        } else {
          Swal.fire('Error!', result.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error!', 'Terjadi kesalahan server.', 'error');
        console.error(err);
      }
    });
  }
}

export default RegisterPage;
