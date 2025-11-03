// src/services/tokenStorage.js
import config from '../config';

class TokenStorage {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.loadTokens();
  }

  // Load tokens from storage
  loadTokens() {
    try {
      this.accessToken = localStorage.getItem(config.tokenStorageKey);
      this.refreshToken = localStorage.getItem(config.refreshTokenStorageKey);
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
      this.clearTokens();
    }
  }

  // Set tokens in memory and storage
  setTokens(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken ? refreshToken : this.refreshToken;

    try {
      if (accessToken) {
        localStorage.setItem(config.tokenStorageKey, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(config.refreshTokenStorageKey, refreshToken);
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  // Clear tokens from memory and storage
  clearTokens(accessTokenOnly = false) {
    if (!accessTokenOnly) {
      this.refreshToken = null;
    }
    this.accessToken = null;
    
    try {
      if (!accessTokenOnly) {
        localStorage.removeItem(config.refreshTokenStorageKey);
      }
      localStorage.removeItem(config.tokenStorageKey);
    } catch (error) {
      console.error('Failed to clear tokens from storage:', error);
    }
  }

  // Get current token
  getToken() {
    return this.accessToken;
  }

  // Get current refresh token
  getRefreshToken() {
    return this.refreshToken;
  }

  // Check if user has a token (doesn't validate it)
  hasToken() {
    return !!this.accessToken;
  }
}

// Create a singleton instance
export const tokenStorage = new TokenStorage();
