// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Database, 
  Radio, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';

export const LoginPage = () => {
  // Empty by default like a real website - flexible and user controlled
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    userCount: 7,
    recentLogs: [],
    loading: true
  });
  const [showLiveStream, setShowLiveStream] = useState(false);

  const { login, user: currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/dashboard';

  // Demo enterprise accounts that can be selected to fill credentials
  const demoRoles = [
    {
      id: 'Admin',
      name: 'System Admin',
      email: 'admin@sail.gov.in',
      tag: 'Full',
      tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: '👑'
    },
    {
      id: 'Logistics',
      name: 'Logistics Mgr',
      email: 'logistics@sail.gov.in',
      tag: 'Fleet',
      tagColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      icon: '🚢'
    },
    {
      id: 'Procurement',
      name: 'Procurement',
      email: 'procurement@sail.gov.in',
      tag: 'Deals',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: '💼'
    },
    {
      id: 'Analyst',
      name: 'Market Analyst',
      email: 'analyst@sail.gov.in',
      tag: 'ML',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: '📊'
    }
  ];

  // Fetch real-time MongoDB status and recent logs
  const fetchDbStatus = async () => {
    try {
      const res = await authService.getStatus();
      if (res?.success) {
        setDbStatus({
          connected: res.connected,
          userCount: res.userCount,
          recentLogs: res.recentLogs || [],
          loading: false
        });
      }
    } catch (err) {
      console.warn('Real-time DB status check:', err.message);
      setDbStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDbStatus();
    const timer = setInterval(fetchDbStatus, 5000); // 5s live polling
    return () => clearInterval(timer);
  }, []);

  // Selecting a role populates the inputs for preview / editing. Does NOT auto-sign in.
  const handleSelectRole = (role) => {
    if (selectedRole === role.id) {
      // Deselect and clear
      setSelectedRole(null);
      setEmail('');
      setPassword('');
    } else {
      // Fill credentials for user to review and manually submit
      setSelectedRole(role.id);
      setEmail(role.email);
      setPassword('password123');
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    const match = demoRoles.find(r => r.email.toLowerCase() === val.trim().toLowerCase());
    setSelectedRole(match ? match.id : null);
  };

  const handleClear = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      addToast('Please provide both official email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res?.success) {
        addToast(`Welcome, ${res.user?.name || 'Officer'}! Signed in to SAIL Logistics Terminal.`, 'success');
        navigate(destination, { replace: true });
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const appendDomain = () => {
    if (!email.includes('@')) {
      handleEmailChange(`${email.trim()}@sail.gov.in`);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Top Real-Time MongoDB Telemetry Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dbStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-mono text-[11px] text-slate-200 flex items-center gap-1.5 font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Atlas:</span>
            <span className="text-emerald-400">{dbStatus.connected ? 'LIVE & SYNCHRONIZED' : 'LOCAL FALLBACK'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="hidden sm:inline bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
            👥 {dbStatus.userCount} Active Officers
          </span>
          <button 
            type="button"
            onClick={() => setShowLiveStream(!showLiveStream)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 hover:underline"
          >
            <Activity className="w-3 h-3" />
            <span>{showLiveStream ? 'Hide Feed' : 'Live Feed'}</span>
          </button>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 shadow-2xl space-y-6 text-slate-100">
        
        {/* Navigation Tabs: Sign In / Register */}
        <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs">
          <button
            type="button"
            className="flex-1 py-2 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-ocean-500 to-cyan-500 text-slate-950 shadow-md shadow-ocean-500/25 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <Link
            to="/register"
            className="flex-1 py-2 px-4 rounded-xl font-medium text-slate-400 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Register Officer</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Active Session Notification (if user is already logged in) */}
        {currentUser && (
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
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

        {/* Title & Context */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>Logistics Officer Sign In</span>
          </h2>
          <p className="text-xs text-slate-400">
            Steel Authority of India Ltd (SAIL) • OceanCharter AI Strategic Terminal
          </p>
        </div>

        {/* Interactive Role Quick-Fill Cards (Flexible, User Controlled, No Auto-Login) */}
        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Select Enterprise Role (Click to Fill)</span>
            </span>
            {selectedRole ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 underline"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Clear Selection</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-500">Optional demo accounts</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {demoRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`group p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-850/70 hover:bg-slate-800/80 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>{role.icon}</span>
                      <span>{role.name}</span>
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${role.tagColor}`}>
                      {isSelected ? '✓ Selected' : role.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {role.email}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Official SAIL Email</label>
              {!email.includes('@') && email.length > 0 && (
                <button
                  type="button"
                  onClick={appendDomain}
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
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="officer@sail.gov.in or click a role above"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedRole ? 'Preset: password123' : 'Enter account password'}
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs text-white bg-slate-950/70 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Security Status */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-ocean-500 focus:ring-ocean-500 bg-slate-950"
              />
              <span>Remember workstation</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">SAIL SSL-Secured</span>
          </div>

          {/* Manual Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ocean-500 via-cyan-500 to-sky-400 hover:from-ocean-400 hover:via-cyan-400 hover:to-sky-300 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating with MongoDB Atlas...</span>
              </>
            ) : (
              <>
                <span>{selectedRole ? `Sign In as ${selectedRole}` : 'Sign In to Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Live MongoDB Audit Stream Box */}
        {showLiveStream && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>MongoDB Real-Time Audit Feed</span>
              </span>
              <span className="text-[10px] text-slate-500">Live polling</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {dbStatus.recentLogs.length === 0 ? (
                <div className="text-slate-500 text-[10px] py-2 text-center">No recent audit events in MongoDB.</div>
              ) : (
                dbStatus.recentLogs.map((log) => (
                  <div key={log._id} className="flex items-center justify-between py-1 border-b border-slate-850 last:border-0 text-[10px]">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        log.action === 'REGISTER' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : log.status === 'SUCCESS' 
                            ? 'bg-cyan-500/20 text-cyan-400' 
                            : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-300 truncate">{log.name || log.email}</span>
                      <span className="text-slate-500">({log.role || 'Officer'})</span>
                    </div>
                    <span className="text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Don't have an officer account yet?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
            Register new officer profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
