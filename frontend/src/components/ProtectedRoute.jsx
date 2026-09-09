// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Anchor } from 'lucide-react';

export const ProtectedRoute = () => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-ocean-500/40 flex items-center justify-center shadow-xl shadow-ocean-500/20">
            <Anchor className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-base text-white font-mono">
            Verifying Officer Clearance
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Checking MongoDB Atlas credentials & RBAC authorization...
          </p>
        </div>
      </div>
    );
  }

  // If no user or no valid token, redirect to /login and remember the attempted URL
  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
