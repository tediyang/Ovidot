import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { tokenStorage } from '../services/storage';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(apiService.isAuthenticated());
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid token on app load
    if (apiService.isAuthenticated()) {
      // Try to fetch user profile to verify token is still valid
      apiService.getData(`${config.apiEndpoints.auth.users}/fetch`)
        .then(userData => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Token validation failed', error);
          tokenStorage.clearTokens(true); // Clear only access token
          setIsAuthenticated(false);
        })
        .finally(() => {
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    authLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
