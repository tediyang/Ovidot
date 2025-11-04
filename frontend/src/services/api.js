import config from "../config";
import { tokenStorage } from "./storage";
import axios from "axios";

class ApiService {
  constructor() {
    this.baseUrl = config.backendUrl;
  }

  /**
   * Gets the headers object with the Authorization header set to the Bearer
   * token if one is stored in the token storage.
   *
   * @return {Object} The headers object with the Authorization header set.
   */
  getAuthHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const accessToken = tokenStorage.getToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  /**
   * Refreshes the access token for the user if the refresh token is available in
   * the token storage.
   *
   * @throws {Error} If the refresh token is not available, or if the refresh
   *   endpoint returns an error.
   * @return {string} The refreshed access token.
   */
  async refreshAuthToken() {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      let response;

      try {
        response = await axios.get(
          `${this.baseUrl}${config.prefix}${config.apiEndpoints.general.refreshToken}/${refreshToken}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        throw error || new Error("Failed to refresh token");
      }

      const data = response.data;
      tokenStorage.setTokens(data.token);
      return data.token;
    } catch (error) {
      tokenStorage.clearTokens();
      throw error;
    }
  }

  /**
   * Sends a request to the specified endpoint, using the specified method and
   * options. If the response is a 401 error, it will try to refresh the
   * authentication token and retry the request. If the refresh fails, it will
   * clear the tokens and throw an error.
   *
   * @param {string} endpoint The API endpoint to call.
   * @param {string} method The HTTP method to use for the request.
   * @param {object} [options] Additional options for the request:
   *   - headers: Additional headers to send with the request.
   *   - body: The request body to send.
   * @returns {Promise<object>} The response data from the API.
   * @throws {Error} If the request fails, or if the response is not a JSON
   *   object.
   */
  async sendRequest(endpoint, method, options = {}) {
    const url = `${this.baseUrl}${config.prefix}${endpoint}`;

    // Merge headers
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    let response;

    try {
      if (method === "GET") {
        response = await axios.get(url, {
          headers,
        });
      } else if (method === "POST") {
        response = await axios.post(url, options.body, {
          headers,
        });
      } else if (method === "PUT") {
        response = await axios.put(url, options.body, {
          headers,
        });
      } else if (method === "DELETE") {
        response = await axios.delete(url, {
          headers,
        });
      }
    } catch (error) {
      const status = error.response?.status;

      if (status === 304) {
        // Return a successful, but empty, response object to prevent errors
        return { data: null };
      }

      if (status === 401 && error.response?.data?.second_chance && tokenStorage.getRefreshToken()) {
        try {
          const newToken = await this.refreshAuthToken();

          // Update Authorization header with new token
          headers["Authorization"] = `Bearer ${newToken}`;

          // Retry the original request
          if (method === "GET") {
            response = await axios.get(url, {
              headers,
            });
          } else if (method === "POST") {
            response = await axios.post(url, options.body, {
              headers,
            });
          } else if (method === "PUT") {
            response = await axios.put(url, options.body, {
              headers,
            });
          } else if (method === "DELETE") {
            response = await axios.delete(url, {
              headers,
            });
          }
          return response.data;
        } catch (error) {
          // If refresh fails, clear tokens and throw error
          tokenStorage.clearTokens();
          throw new Error("Authentication failed. Please log in again.");
        }
      }

      if (status !== 200) {
        if (status === 401) {
          tokenStorage.clearTokens();
          throw new Error("Authentication required. Please log in.");
        }

        throw error.response;
      }
    }

    return response;
  }

  /**
   * Performs a login request with the given credentials.
   *
   * If the response contains an access token and a refresh token, they will be
   * stored in the token storage.
   *
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.email - The user's email address.
   * @param {string} credentials.password - The user's password.
   * @return {Promise<Object>} The parsed response body.
   * @throws {Error} If the request fails or the response has an error status.
   */
  async login(credentials) {
    let response;
    try {
      response = await this.sendRequest(
        config.apiEndpoints.general.login,
        "POST",
        {
          body: JSON.stringify(credentials),
        }
      );

      if (response.tokens) {
        tokenStorage.setTokens(
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
      }
    } catch (error) {
      throw error?.data || error;
    }

    return response.data;
  }

  /**
   * Registers a new user.
   *
   * @param {Object} userData - The user's data.
   * @param {string} userData.email - The user's email address.
   * @param {string} userData.lname - The user's last name.
   * @param {string} userData.fname - The user's first name.
   * @param {string} userData.password - The user's password.
   * @param {string} userData.dob - The user's DOB
   * @param {string} userData.phone - The user's phone number.
   * @param {string} userData.username - The user's username.
   * @return {Promise<Object>} The parsed response body.
   * @throws {Error} If the request fails or the response has an error status.
   */
  async register(userData) {
    try {
      return this.sendRequest(config.apiEndpoints.general.signup, "POST", {
        body: JSON.stringify(userData),
      });
    } catch (error) {
      throw error.data;
    }
  }

  /**
   * Logs out the user.
   *
   * If the logout API endpoint is available, it will be called to invalidate the
   * access token on the server side. Regardless of whether the API call succeeds
   * or fails, the locally stored tokens will be cleared.
   *
   * @return {Promise<void>} Resolves when the API call is complete.
   */
  async logout() {
    try {
      // Try to call logout endpoint if available
      const response = await this.sendRequest(config.apiEndpoints.auth.logout, "GET");
      return response
    } catch (error) {
      // Even if logout API call fails, clear tokens locally
      console.warn("Logout API call failed", error);
      tokenStorage.clearTokens();
      throw error.data;
    } finally {
      tokenStorage.clearTokens();
    }
  }

  /**
   * Checks if the user has an access token stored locally.
   *
   * @return {boolean} True if the user has an access token, false otherwise.
   */
  isAuthenticated() {
    return tokenStorage.hasToken();
  }

  /**
   * Fetches data from a specified API endpoint.
   *
   * @param {string} path - The key of the API endpoint in the config.
   * @return {Promise<Object>} The response body of the API call.
   * @throws {Error} If the API endpoint is not specified in the config.
   */
  async getData(path) {
    try {
      return (await this.sendRequest(path, "GET")).data;
    } catch (error) {
      throw error.data;
    }
  }

  /**
   * Posts data to a specified API endpoint.
   *
   * @param {string} path - The key of the API endpoint in the config.
   * @param {Object} data - The data to be posted.
   * @return {Promise<Object>} The response body of the API call.
   * @throws {Error} If the API endpoint is not specified in the config.
   */
  async postData(path, data) {
    try {
      return await this.sendRequest(path, "POST", {
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log('yes')
      throw error.data;
    }
  }

  /**
   * Puts data to a specified API endpoint with a specific id.
   *
   * @param {string} path - The key of the API endpoint in the config.
   * @param {string} id - The id of the data to be updated.
   * @param {Object} data - The data to be updated.
   * @return {Promise<Object>} The response body of the API call.
   * @throws {Error} If the API endpoint or id is not specified.
   */
  async putData(path, id, data) {
    try {
      if (id) {
        path += `/${id}`
      }
      return await this.sendRequest(`${path}`, "PUT", {
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error.data;
    }
  }

  /**
   * Deletes data from a specified API endpoint with a specific id.
   *
   * @param {string} path - The key of the API endpoint in the config.
   * @param {string} id - The id of the data to be deleted.
   * @return {Promise<Object>} The response body of the API call.
   * @throws {Error} If the API endpoint or id is not specified.
   */

  async deleteData(path, id) {
    try {
      return await this.sendRequest(`${path}/${id}`, "DELETE");
    } catch (error) {
      throw error.data;
    }
  }
}

export const apiService = new ApiService();
