import { createContext, useContext, useState, useEffect } from 'react';
import { adminStorage } from '../services/adminStorage';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState(true);

  useEffect(() => {
    const token = adminStorage.getToken();
    if (token && !adminStorage.isExpired()) {
      const payload = adminStorage.getPayload();
      setIsAdminAuthenticated(true);
      setAdminRole(payload?.role || null);
    } else {
      adminStorage.clearToken();
      setIsAdminAuthenticated(false);
    }
    setAdminAuthLoading(false);
  }, []);

  const value = { isAdminAuthenticated, adminRole, adminAuthLoading };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
