// frontend/src/components/RealtimeAuthMonitor.jsx
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  UserCheck, 
  UserX, 
  UserPlus, 
  RefreshCw, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Radio
} from 'lucide-react';
import { authService } from '../services/api';

export const RealtimeAuthMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'users'
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = async () => {
    try {
      const [logsRes, usersRes] = await Promise.all([
        authService.getLogs({ limit: 20 }),
        authService.getUsers()
      ]);
      if (logsRes?.success) setLogs(logsRes.logs || []);
      if (usersRes?.success) setUsers(usersRes.users || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to poll MongoDB auth activity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    let interval = null;
    if (isLive) {
      interval = setInterval(fetchData, 4000); // Live poll every 4s
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const getActionBadge = (action, status) => {
    if (action === 'REGISTER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <UserPlus className="w-3 h-3" />
          Registered
        </span>
      );
    }
    if (action === 'LOGIN' && status === 'SUCCESS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <UserCheck className="w-3 h-3" />
          Signed In
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <UserX className="w-3 h-3" />
        Failed Login
      </span>
    );
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + d.toLocaleDateString() + ')';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-850">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                MongoDB Real-Time Auth & Activity Stream
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                MongoDB Atlas Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live persistent audit logs for all logins, registrations & officer access
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isLive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse text-emerald-500' : ''}`} />
            {isLive ? 'Live Stream On' : 'Live Paused'}
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Registered Users in DB</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">{users.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Real-Time Events</span>
          <span className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">{logs.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Database Provider</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block truncate">MongoDB Atlas Cloud</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Last Sync</span>
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1 block truncate">
            {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 pt-2 gap-2 text-xs font-semibold bg-white dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'events'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Real-Time Sign In & Register Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Registered Users in MongoDB ({users.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        {activeTab === 'events' ? (
          logs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No auth events recorded yet. Register a new user or sign in to see real-time updates!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Event</th>
                  <th className="py-2.5 px-4">Officer / Email</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-4">Client IP</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {getActionBadge(log.action, log.status)}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">{log.name || 'Anonymous'}</div>
                      <div className="text-[11px] text-slate-500">{log.email}</div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {log.role || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {log.details || log.organization || '—'}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-[11px] font-mono text-slate-400">
                      {log.ip || '127.0.0.1'}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-right font-mono text-[11px] text-slate-500">
                      {formatTime(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Organization</th>
                <th className="py-2.5 px-4">Sign-in Count</th>
                <th className="py-2.5 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {u.name}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-slate-500 truncate max-w-[200px]">
                    {u.organization || 'SAIL'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                    {u.loginCount || 0} times
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap text-right font-mono text-[11px] text-slate-500">
                    {u.lastLogin ? formatTime(u.lastLogin) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RealtimeAuthMonitor;
