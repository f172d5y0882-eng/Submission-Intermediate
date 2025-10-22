// Fungsi register
export async function registerUser(name, email, password) {
  const res = await fetch('https://story-api.dicoding.dev/v1/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  return res.json();
}

// Fungsi login
export async function loginUser(email, password) {
  const res = await fetch('https://story-api.dicoding.dev/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();
  if (result && result.loginResult && result.loginResult.token) {
    localStorage.setItem('authToken', result.loginResult.token);
  }

  return result;
}

// Fungsi ambil daftar cerita
export async function getStories() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
  }

  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal mengambil data cerita');
  }

  return response.json();
}

