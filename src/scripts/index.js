import '../styles/styles.css';
import { login, register, getAuthToken, logout } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const token = getAuthToken();

  if (!token) {
    renderLoginForm(mainContent);
  } else {
    renderDashboard(mainContent);
  }
});

// ===== RENDER LOGIN =====
function renderLoginForm(mainContent) {
  mainContent.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <label>Email:</label>
      <input type="email" id="email" required />
      <label>Password:</label>
      <input type="password" id="password" required />
      <button type="submit">Login</button>
    </form>
    <p>Belum punya akun? <a href="#" id="goRegister">Register</a></p>
  `;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await login(email, password);
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('goRegister').addEventListener('click', (e) => {
    e.preventDefault();
    renderRegisterForm(mainContent);
  });
}

// ===== RENDER REGISTER =====
function renderRegisterForm(mainContent) {
  mainContent.innerHTML = `
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
    <p>Sudah punya akun? <a href="#" id="goLogin">Login</a></p>
  `;

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
      await register(name, email, password);
      alert('Registrasi berhasil! Silakan login.');
      renderLoginForm(mainContent);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('goLogin').addEventListener('click', (e) => {
    e.preventDefault();
    renderLoginForm(mainContent);
  });
}

// ===== DASHBOARD JIKA SUDAH LOGIN =====
function renderDashboard(mainContent) {
  mainContent.innerHTML = `
    <h2>Selamat datang!</h2>
    <button id="logoutBtn">Logout</button>
  `;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    location.reload();
  });

  initPushNotification();
}

// ===== PUSH NOTIFICATION =====
async function initPushNotification() {
  const token = getAuthToken();
  if (!token) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: '<VAPID_PUBLIC_KEY>',
  });

  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // langsung pakai token hasil login
    },
    body: JSON.stringify(subscription),
  });
}
