import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleAuthChange = () => {
      if (!localStorage.getItem('token')) {
        setUser(null);
      }
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const token = res.data.access_token || res.data.token;
    if (!token) throw new Error('No token returned');
    localStorage.setItem('token', token);
    const userRes = await authApi.getMe();
    setUser(userRes.data);
  };

  const signup = async (data) => {
    // Signup returns a message, not a token. So we just call signup then auto-login.
    await authApi.signup(data);
    // Now auto-login with the same credentials
    const loginRes = await authApi.login({ username: data.username, password: data.password });
    const token = loginRes.data.access_token || loginRes.data.token;
    if (!token) throw new Error('Login after signup failed');
    localStorage.setItem('token', token);
    const userRes = await authApi.getMe();
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
