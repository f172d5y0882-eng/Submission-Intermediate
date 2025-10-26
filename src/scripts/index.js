// src/scripts/index.js
import '../styles/styles.css';
import { login, register, logout, getAuthToken } from "./auth.js";


document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const token = getAuthToken();

  // === Drawer Menu ===
  const drawerBtn = document.getElementById('drawer-button');
  const navDrawer = document.getElementById('navigation-drawer');

  if (drawerBtn && navDrawer) {
    drawerBtn.addEventListener('click', () => {
      navDrawer.classList.toggle('open'); // tambahkan/tutup class "open"
    });

    // otomatis tutup drawer setelah klik menu
    document.querySelectorAll('#nav-list a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
      });
    });
  }

  // === Auth ===
  if (!token) {
    mainContent.innerHTML = `
      <h2>Login</h2>
      <form id="loginForm">
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Password:</label>
        <input type="password" id="password" required />
        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <a href="#" id="showRegister">Register</a></p>
      <div id="registerSection" style="display:none;">
        <h2>Register</h2>
        <form id="registerForm">
          <label>Nama:</label>
          <input type="text" id="regName" required />
          <label>Email:</label>
          <input type="email" id="regEmail" required />
          <label>Password:</label>
          <input type="password" id="regPassword" required />
          <button type="submit">Register</button>
        </form>
      </div>
    `;

    document.getElementById('showRegister').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerSection').style.display = "block";
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await login(email, password);
        alert("Login sukses");
        location.reload();
      } catch (err) {
        alert(err.message);
      }
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      try {
        await register(name, email, password);
        alert("Registrasi sukses, silakan login");
        location.reload();
      } catch (err) {
        alert(err.message);
      }
    });
  } else {
    mainContent.innerHTML = `
      <h2>Selamat datang!</h2>
      <button id="logoutBtn">Logout</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      logout();
      location.reload();
    });
  }
});
