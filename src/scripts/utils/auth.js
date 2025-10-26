// src/scripts/utils/auth.js

const TOKEN_KEY = 'dicoding_token';

const AuthUtils = {
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default AuthUtils;
