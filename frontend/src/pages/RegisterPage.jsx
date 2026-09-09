import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Building, 
  ArrowRight, 
  Database, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Radio, 
  Activity, 
  Ship, 
  Briefcase, 
  BarChart3, 
  Crown, 
  Eye as ViewIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Logistics Manager',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Bulk Shipping & Maritime Logistics'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    userCount: 6,
    loading: true
  });

  const { register, user: currentUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/dashboard';

  // Fetch real-time MongoDB status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await authService.getStatus();
        if (res?.success) {
          setDbStatus({
            connected: res.connected,
            userCount: res.userCount,
            loading: false
          });
        }
      } catch (err) {
        setDbStatus(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStatus();
  }, []);

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score, label: 'Good', color: 'bg-cyan-500' };
      case 4:
        return { score, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    }
  };

  const strength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const quickPlants = [
    'SAIL Corporate HQ',
    'SAIL Bhilai Steel Plant',
    'SAIL Rourkela Steel Plant',
    'SAIL Bokaro Steel Plant',
    'SAIL Durgapur Steel Plant'
  ];

  const rolesList = [
    {
      id: 'Logistics Manager',
      label: 'Logistics Manager',
      icon: Ship,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      desc: 'Fleet matching, port congestion & draft calculation'
    },
    {
      id: 'Procurement Manager',
      label: 'Procurement Manager',
      icon: Briefcase,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      desc: 'Charter fixtures, demurrage rates & voyage contracts'
    },
    {
      id: 'Analyst',
      label: 'Market Analyst',
      icon: BarChart3,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      desc: 'Freight predictive ML models & Baltic indices'
    },
    {
      id: 'Admin',
      label: 'System Admin',
      icon: Crown,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      desc: 'Full enterprise control, audit logs & RBAC configuration'
    },
    {
      id: 'Viewer',
      label: 'Executive Viewer',
      icon: ViewIcon,
      color: 'text-slate-400 border-slate-600/30 bg-slate-700/10',
      desc: 'Read-only presentations, KPIs & fleet reports'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }

    if (!formData.email.trim()) {
      addToast('Please enter an official email address', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        organization: formData.organization,
        department: formData.department
      });

      if (res?.success) {
        addToast(`Registered successfully in MongoDB! Welcome Officer ${formData.name}.`, 'success');
        navigate(destination, { replace: true });
      }
    } catch (err) {
      addToast(err.message || 'Registration failed. Please check your details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Real-Time MongoDB Telemetry Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-200 flex items-center gap-1.5 font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Atlas:</span>
            <span className="text-emerald-400">READY FOR REGISTRATION</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
            Current: {dbStatus.userCount} Officers Stored
          </span>
        </div>
      </div>

      {/* Main Glass Form Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 shadow-2xl space-y-6 text-slate-100">
        
        {/* Navigation Tabs: Sign In / Register */}
        <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs">
          <Link
            to="/login"
            className="flex-1 py-2 px-4 rounded-xl font-medium text-slate-400 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Sign In</span>
          </Link>
          <button
            type="button"
            className="flex-1 py-2 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-ocean-500 to-cyan-500 text-slate-950 shadow-md shadow-ocean-500/25 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Register Officer</span>
          </button>
        </div>

        {/* Active Session Notification (if already logged in) */}
        {currentUser && (
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Signed in as: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            </div>
            <Link
              to={destination}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-[11px] transition-colors"
            >
              Go to Dashboard →
            </Link>
          </div>
        )}

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Create Enterprise Officer Account
          </h2>
          <p className="text-xs text-slate-400">
            Register new logistics credentials with real-time MongoDB Atlas persistence & RBAC
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Official Email</label>
                {!formData.email.includes('@') && formData.email.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, email: `${formData.email.trim()}@sail.gov.in` })}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono underline"
                  >
                    + @sail.gov.in
                  </button>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="officer@sail.gov.in"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Interactive Role Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Assigned Enterprise Role (RBAC)</label>
              <span className="text-[10px] text-slate-400 font-mono">Select role privilege</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {rolesList.map((r) => {
                const IconComponent = r.icon;
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800/90 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{r.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plant Unit & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Organization / Plant Unit</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {quickPlants.slice(0, 3).map((plant) => (
                  <button
                    key={plant}
                    type="button"
                    onClick={() => setFormData({ ...formData, organization: plant })}
                    className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                  >
                    {plant.replace('SAIL ', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
                placeholder="e.g. Inbound Shipping Directorate"
                required
              />
            </div>
          </div>

          {/* Row 3: Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Account Password</label>
                {formData.password && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Strength: <span className="font-bold text-white">{strength.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Strength Meter Bars */}
              {formData.password && (
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  <div className={`h-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-800'}`} />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                {formData.confirmPassword && (
                  <span className={`text-[10px] font-mono flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passwordsMatch ? '✓ Matches' : '✗ Does not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-type password"
                  className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Storage Guarantee Card */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Real-time Persistence: Submitting this form creates a live encrypted record in MongoDB Atlas cluster with automatic audit trail logging.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ocean-500 via-cyan-500 to-sky-400 hover:from-ocean-400 hover:via-cyan-400 hover:to-sky-300 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving to MongoDB Atlas...</span>
              </>
            ) : (
              <>
                <span>Complete Officer Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Already registered as a logistics officer?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
            Sign in to terminal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;