import { createContext, useContext, useState } from 'react';
import api from '../lib/api';

// 1. Create the Context object — not a component, just a value container
const AuthContext = createContext(null);

// 2. Provider — a regular function component (function + return JSX)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    // { token, ...userData } : destructuring that pulls token out on its own,
    // while the rest of the fields (id, email, cashBalance) land together in userData.

    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    const { token, ...userData } = response.data;

    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — a function, but doesn't return JSX (not a component)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
