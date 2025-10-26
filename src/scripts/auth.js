// src/scripts/auth.js

const API_BASE_URL = "https://story-api.dicoding.dev/v1";

// Simpan token ke localStorage
export function saveAuthToken(token) {
  localStorage.setItem("authToken", token);
}

// Ambil token dari localStorage
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Hapus token (logout)
export function logout() {
  localStorage.removeItem("authToken");
  window.location.hash = "#/login";
}

// Login user
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Login gagal");
    }

    saveAuthToken(data.loginResult.token);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Register user
export async function register(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Registrasi gagal");
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}
