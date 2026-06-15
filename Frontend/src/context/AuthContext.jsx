import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('propspace_token');
    const storedUser = localStorage.getItem('propspace_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('propspace_token');
        localStorage.removeItem('propspace_user');
      }
    }
    setLoading(false);
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
