import { createContext, useContext, useState } from 'react';
import api from '../lib/api';

// 1. Context 객체 생성 — 함수 컴포넌트 아님, 그냥 값을 담는 그릇
const AuthContext = createContext(null);

// 2. Provider — 일반 함수 컴포넌트 (function + return JSX)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    // { token, ...userData } : 응답 객체에서 token만 따로 꺼내고,
    // 나머지 필드(id, email, cashBalance)는 통째로 userData에 담는 구조 분해 문법.

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

// 3. 커스텀 훅 — 함수는 맞는데 JSX를 반환하지 않음 (컴포넌트가 아님)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
