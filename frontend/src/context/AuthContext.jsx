// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('oceancharter_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize active user
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('oceancharter_token');
      const storedUser = localStorage.getItem('oceancharter_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          console.error('Failed to parse stored auth user', e);
        }
      } else if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored auth user', e);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email: email.trim(), password });
      if (res?.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('oceancharter_token', res.token);
        localStorage.setItem('oceancharter_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Invalid email or password.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res?.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('oceancharter_token', res.token);
        localStorage.setItem('oceancharter_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Registration failed.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      throw new Error(msg);
    }
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('oceancharter_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('oceancharter_token');
    localStorage.removeItem('oceancharter_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

