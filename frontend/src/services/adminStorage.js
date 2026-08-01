import config from '../config';

class AdminStorage {
  constructor() {
    this.token = null;
    this.loadToken();
  }

  loadToken() {
    try {
      this.token = localStorage.getItem(config.adminTokenStorageKey);
    } catch {
      this.token = null;
    }
  }

  setToken(token) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem(config.adminTokenStorageKey, token);
      }
    } catch (error) {
      console.error('Failed to store admin token:', error);
    }
  }

  clearToken() {
    this.token = null;
    try {
      localStorage.removeItem(config.adminTokenStorageKey);
    } catch (error) {
      console.error('Failed to clear admin token:', error);
    }
  }

  getToken() {
    return this.token;
  }

  hasToken() {
    return !!this.token;
  }

  /** Decode the JWT payload to get { id, role, exp } without a library. */
  getPayload() {
    if (!this.token) return null;
    try {
      return JSON.parse(atob(this.token.split('.')[1]));
    } catch {
      return null;
    }
  }

  isExpired() {
    const payload = this.getPayload();
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
  }
}

export const adminStorage = new AdminStorage();
