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

  const DEMO_PROFILES = {
    'admin@sail.gov.in': {
      name: 'System Admin (SAIL)',
      role: 'Admin',
      organization: 'SAIL Corporate HQ',
      department: 'Logistics IT'
    },
    'logistics@sail.gov.in': {
      name: 'Chief Logistics Officer',
      role: 'Logistics Manager',
      organization: 'SAIL Corporate HQ',
      department: 'Logistics Operations'
    },
    'procurement@sail.gov.in': {
      name: 'Commercial Procurement Lead',
      role: 'Procurement Officer',
      organization: 'SAIL Bhilai Steel Plant',
      department: 'Raw Materials Commercial'
    },
    'analyst@sail.gov.in': {
      name: 'Lead Maritime Analyst',
      role: 'Market Analyst',
      organization: 'SAIL Logistics Directorate',
      department: 'Intelligence & Research'
    }
  };

  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
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
      // If server responded with a 4xx credential error, preserve the server message
      const status = err.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
        throw new Error(msg);
      }

      // If network error (e.g. backend running locally on developer's laptop, unreachable for external visitors)
      console.warn('Backend server unreachable, initiating demo/offline authentication fallback:', err.message);

      // 1. Check local registered users in browser
      try {
        const storedUsers = JSON.parse(localStorage.getItem('oceancharter_registered_users') || '[]');
        const localMatch = storedUsers.find(u => u.email && u.email.toLowerCase() === trimmedEmail);
        if (localMatch) {
          if (localMatch.password && localMatch.password !== password) {
            throw new Error('Invalid password for registered account.');
          }
          const demoToken = 'demo-jwt-' + Date.now();
          const authUser = {
            id: localMatch.id || 'usr_' + Date.now(),
            name: localMatch.name,
            email: localMatch.email,
            role: localMatch.role || 'Logistics Manager',
            organization: localMatch.organization || 'SAIL Corporate HQ',
            department: localMatch.department || 'Operations',
            isDemoMode: true
          };
          setUser(authUser);
          setToken(demoToken);
          localStorage.setItem('oceancharter_token', demoToken);
          localStorage.setItem('oceancharter_user', JSON.stringify(authUser));
          return { success: true, user: authUser, isDemoMode: true };
        }
      } catch (storageErr) {
        console.warn('Error reading local registered users:', storageErr);
      }

      // 2. Check enterprise demo profiles
      if (DEMO_PROFILES[trimmedEmail]) {
        const profile = DEMO_PROFILES[trimmedEmail];
        const demoUser = {
          id: 'demo_' + trimmedEmail.split('@')[0],
          name: profile.name,
          email: trimmedEmail,
          role: profile.role,
          organization: profile.organization,
          department: profile.department,
          isDemoMode: true
        };
        const demoToken = 'demo-jwt-' + Date.now();
        setUser(demoUser);
        setToken(demoToken);
        localStorage.setItem('oceancharter_token', demoToken);
        localStorage.setItem('oceancharter_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser, isDemoMode: true };
      }

      // 3. Any valid credentials in demo environment allow entry
      if (trimmedEmail && password && password.length >= 6) {
        const username = trimmedEmail.split('@')[0];
        const fallbackUser = {
          id: 'officer_' + Date.now(),
          name: username.charAt(0).toUpperCase() + username.slice(1) + ' (Officer)',
          email: trimmedEmail,
          role: 'Logistics Manager',
          organization: 'SAIL Logistics Directorate',
          department: 'Maritime Operations',
          isDemoMode: true
        };
        const demoToken = 'demo-jwt-' + Date.now();
        setUser(fallbackUser);
        setToken(demoToken);
        localStorage.setItem('oceancharter_token', demoToken);
        localStorage.setItem('oceancharter_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser, isDemoMode: true };
      }

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
      const status = err.response?.status;
      if (status === 400 || status === 409) {
        throw new Error(err.response?.data?.message || 'Email already registered or invalid details.');
      }

      // Backend unreachable: store in browser localStorage so registration works seamlessly
      console.warn('Backend server unreachable during registration, saving locally for session:', err.message);
      const newLocalUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Logistics Manager',
        organization: userData.organization || 'SAIL Corporate HQ',
        department: userData.department || 'Operations',
        password: userData.password,
        isDemoMode: true
      };

      try {
        const storedUsers = JSON.parse(localStorage.getItem('oceancharter_registered_users') || '[]');
        storedUsers.push(newLocalUser);
        localStorage.setItem('oceancharter_registered_users', JSON.stringify(storedUsers));
      } catch (storageErr) {
        console.warn('Failed saving local user:', storageErr);
      }

      const demoToken = 'demo-jwt-' + Date.now();
      setUser(newLocalUser);
      setToken(demoToken);
      localStorage.setItem('oceancharter_token', demoToken);
      localStorage.setItem('oceancharter_user', JSON.stringify(newLocalUser));
      return { success: true, user: newLocalUser, isDemoMode: true };
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

