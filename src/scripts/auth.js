// src/scripts/auth.js
const API_URL = "https://story-api.dicoding.dev/v1";

// simpan token ke localStorage
export function saveAuthToken(token) {
  localStorage.setItem("authToken", token);
}

// ambil token dari localStorage
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

// hapus token saat logout
export function logout() {
  localStorage.removeItem("authToken");
}

// register user baru
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || "Registrasi gagal");
  }
  return data;
}

// login user
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || "Login gagal");
  }

  // simpan token
  saveAuthToken(data.loginResult.token);
  return data;
}
