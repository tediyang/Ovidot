// src/config.js
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:1245',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  prefix: process.env.REACT_APP_PREFIX || '/api/v1',
  apiEndpoints: {
    general: {
      signup: '/signup',
      login: '/login',
      forgetPassword: '/forget-password',
      resetPassword: '/reset-password',
      refreshToken: '/refresh-token',
    },
    auth: {
      users: '/auth/users',
      cycles: '/auth/cycles',
      logout: '/auth/logout'
    }
  },
  tokenStorageKey: 'accessToken',
  refreshTokenStorageKey: 'refreshToken',
};

// Validate essential configuration
if (!config.backendUrl) {
  console.error('Backend URL is not configured. Please set REACT_APP_BACKEND_URL');
}

export default config;
