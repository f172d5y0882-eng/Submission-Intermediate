const API_BASE = 'https://story-api.dicoding.dev/v1';

export async function register(username, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: username, email: `${username}@mail.com`, password }),
  });

  if (!response.ok) {
    throw new Error('Gagal register');
  }

  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login gagal');
  }

  const data = await response.json();
  if (data.loginResult && data.loginResult.token) {
    localStorage.setItem('authToken', data.loginResult.token);
  }

  return data;
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function logout() {
  localStorage.removeItem('authToken');
}
