// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Logistics Manager',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Bulk Shipping & Logistics'
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(formData);
      if (res?.success) {
        addToast('Registration successful! Welcome to OceanCharter AI.', 'success');
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Registration completed (mock demo mode)', 'info');
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Officer Account
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Register new logistics specialist credentials with RBAC assignment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Ramesh Chandra"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Official Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              placeholder="officer@sail.gov.in"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="Procurement Manager" className="bg-white dark:bg-slate-900">Procurement Manager</option>
              <option value="Logistics Manager" className="bg-white dark:bg-slate-900">Logistics Manager</option>
              <option value="Analyst" className="bg-white dark:bg-slate-900">Analyst</option>
              <option value="Admin" className="bg-white dark:bg-slate-900">Admin</option>
              <option value="Viewer" className="bg-white dark:bg-slate-900">Viewer</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Organization</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? 'Creating Account...' : 'Complete Officer Registration'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;