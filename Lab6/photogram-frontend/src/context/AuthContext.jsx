import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохранённые данные при загрузке
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('user');
    
    if (token && userId && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { id, username: name, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('user', JSON.stringify({ id, username: name }));
    
    setUser({ id, username: name });
    return { id, username: name };
  };

  const register = async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    const { id, username: name, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('user', JSON.stringify({ id, username: name }));
    
    setUser({ id, username: name });
    return { id, username: name };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};