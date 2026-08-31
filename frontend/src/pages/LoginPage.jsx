// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@sail.gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.success) {
        addToast('Signed in successfully as SAIL Logistics Officer', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    await login(roleEmail, 'password123');
    addToast(`Quick login as ${roleEmail.split('@')[0].toUpperCase()}`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass-panel-glow space-y-6 transition-colors">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SAIL Officer Sign In
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access the OceanCharter AI Strategic Logistics Terminal
        </p>
      </div>

      {/* 1-Click Role Login Quick Selectors */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ocean-600 dark:text-ocean-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>SIH Quick Test Accounts (1-Click)</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@sail.gov.in')}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent text-left font-mono truncate transition-colors shadow-sm"
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('procurement@sail.gov.in')}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent text-left font-mono truncate transition-colors shadow-sm"
          >
            💼 Procurement
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('logistics@sail.gov.in')}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent text-left font-mono truncate transition-colors shadow-sm"
          >
            🚢 Logistics Mgr
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('analyst@sail.gov.in')}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent text-left font-mono truncate transition-colors shadow-sm"
          >
            📊 Market Analyst
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-ocean-500/20 flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : 'Sign In to Terminal'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-ocean-600 dark:text-ocean-400 hover:underline font-semibold">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
