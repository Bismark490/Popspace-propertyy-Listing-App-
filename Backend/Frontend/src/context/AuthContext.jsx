import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Initialize from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('propspace_token');
    const storedUser = localStorage.getItem('propspace_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Cleanup: nothing to teardown for localStorage reads
    return () => {};
  }, []);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('propspace_token', data.token);
    localStorage.setItem('propspace_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('propspace_token');
    localStorage.removeItem('propspace_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('propspace_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
