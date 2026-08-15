import config from '../config';
import { adminStorage } from './adminStorage';
import axios from 'axios';

class AdminApiService {
  constructor() {
    this.baseUrl = config.backendUrl;
    this.prefix = config.prefix;
  }

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = adminStorage.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async sendRequest(endpoint, method, options = {}) {
    const url = `${this.baseUrl}${this.prefix}${endpoint}`;
    const headers = { ...this.getAuthHeaders(), ...options.headers };

    try {
      let response;
      if (method === 'GET') {
        response = await axios.get(url, { headers });
      } else if (method === 'POST') {
        response = await axios.post(url, options.body, { headers });
      } else if (method === 'PUT') {
        response = await axios.put(url, options.body, { headers });
      } else if (method === 'DELETE') {
        response = await axios.delete(url, { headers, data: options.body });
      }
      return response;
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        adminStorage.clearToken();
        throw new Error('Session expired. Please sign in again.');
      }
      throw error.response || error;
    }
  }

  /** Login: returns the full response body { message, token }. */
  async login(credentials) {
    try {
      const response = await this.sendRequest(
        config.apiEndpoints.admin.login,
        'POST',
        { body: JSON.stringify(credentials) }
      );
      const data = response.data;
      if (data.token) adminStorage.setToken(data.token);
      return data;
    } catch (error) {
      throw error?.data || error;
    }
  }

  async logout() {
    try {
      await this.sendRequest(config.apiEndpoints.admin.logout, 'GET');
    } finally {
      adminStorage.clearToken();
    }
  }

  async getData(path) {
    try {
      return (await this.sendRequest(path, 'GET')).data;
    } catch (error) {
      throw error?.data || error;
    }
  }

  async postData(path, data) {
    try {
      return (await this.sendRequest(path, 'POST', { body: JSON.stringify(data) })).data;
    } catch (error) {
      throw error?.data || error;
    }
  }

  async putData(path, data) {
    try {
      return (await this.sendRequest(path, 'PUT', { body: JSON.stringify(data) })).data;
    } catch (error) {
      throw error?.data || error;
    }
  }

  async deleteData(path, data) {
    try {
      return (await this.sendRequest(path, 'DELETE', { body: JSON.stringify(data) })).data;
    } catch (error) {
      throw error?.data || error;
    }
  }

  // ----- Convenience methods -----

  getUsers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.getData(`${config.apiEndpoints.admin.users}${qs ? `?${qs}` : ''}`);
  }

  getUser(email) {
    return this.postData(config.apiEndpoints.admin.userEmail, { email });
  }

  getUserCycles(email, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.postData(
      `${config.apiEndpoints.admin.userCycles}${qs ? `?${qs}` : ''}`,
      { email }
    );
  }

  updateUserEmail(oldEmail, newEmail) {
    return this.putData(config.apiEndpoints.admin.userEmail, { oldEmail, newEmail });
  }

  deleteUser(email) {
    return this.deleteData(config.apiEndpoints.admin.userEmail, { email });
  }

  sendPasswordReset(email, front_url) {
    return this.postData(config.apiEndpoints.admin.userForgotPassword, { email, front_url });
  }

  getCycles(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.getData(`${config.apiEndpoints.admin.cycles}${qs ? `?${qs}` : ''}`);
  }

  getCycle(cycleId) {
    return this.getData(`${config.apiEndpoints.admin.cycles}/${cycleId}`);
  }

  deleteCycle(cycleId) {
    return this.deleteData(`${config.apiEndpoints.admin.cycles}/${cycleId}`);
  }

  switchRole(email_username_id, role) {
    return this.putData(config.apiEndpoints.admin.switchRole, { email_username_id, role });
  }

  createAdmin(adminData) {
    return this.postData(config.apiEndpoints.admin.createAdmin, adminData);
  }

  deactivateActivateAdmin(email_username_id, action) {
    if (action === 'deactivate') {
      return this.putData(config.apiEndpoints.admin.deactivateAdmin, { email_username_id });
    } else if (action === 'activate') {
      return this.putData(config.apiEndpoints.admin.activateAdmin, { email_username_id });
    } else {
      throw new Error('Invalid action. Use "deactivate" or "activate".');
    }
  }
}

export const adminApiService = new AdminApiService();
