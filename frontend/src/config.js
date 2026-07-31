const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:1245',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  prefix: process.env.REACT_APP_PREFIX || '/api/v1',
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  apiEndpoints: {
    general: {
      signup: '/signup',
      signupGoogle: '/signup-google',
      completeRegistration: '/google-complete-registration',
      login: '/login',
      forgetPassword: '/forget-password',
      resetPassword: '/reset-password',
      refreshToken: '/refresh-token',
    },
    auth: {
      users: '/auth/users',
      cycles: '/auth/cycles',
      logout: '/auth/logout'
    },
    admin: {
      login: '/admin/login',
      logout: '/admin/logout',
      users: '/admin/users',
      userEmail: '/admin/users/email',
      userCycles: '/admin/users/email/cycles',
      userForgotPassword: '/admin/users/forgot-password',
      cycles: '/admin/cycles',
      switchRole: '/admin/switch',
      deactivateAdmin: '/admin/deactivate',
    }
  },
  adminTokenStorageKey: 'adminToken',
  googleRegistrationKey: 'googleRegistrationKey',
  tokenStorageKey: 'accessToken',
  refreshTokenStorageKey: 'refreshToken',
};

// Validate essential configuration
if (!config.backendUrl) {
  console.error('Backend URL is not configured. Please set REACT_APP_BACKEND_URL');
}

export default config;
