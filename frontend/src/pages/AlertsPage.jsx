// frontend/src/pages/AlertsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BellRing, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Info, 
  Check, 
  Filter, 
  ArrowRight,
  TrendingUp,
  Anchor,
  Fuel,
  CloudRain
} from 'lucide-react';
import { alertService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertService.getAlerts();
      if (res?.success) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledgeAlert(id);
      setAlerts(alerts.map(a => a._id === id ? { ...a, isAcknowledged: true } : a));
      addToast('Alert acknowledged and logged in audit record', 'success');
    } catch (err) {
      addToast('Failed to acknowledge alert', 'error');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const categories = ['ALL', 'Freight', 'Port', 'Weather', 'Fuel', 'Congestion'];
  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
            <BellRing className="w-4 h-4 text-rose-400" />
            <span>SAIL MARITIME EARLY WARNING RADAR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Active Strategic Alerts & Disruption Feeds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time triggers for freight rate surges, bunker shocks, draught gating, and cyclone alerts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
            {alerts.filter(a => a.severity === 'CRITICAL' && !a.isAcknowledged).length} Critical
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
            {alerts.filter(a => a.severity === 'HIGH' && !a.isAcknowledged).length} High
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-ocean-400" />
            <span>Category:</span>
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                categoryFilter === c
                  ? 'bg-ocean-500 text-white font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2">Severity:</span>
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                severityFilter === s
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl text-slate-500 dark:text-slate-400 text-sm">
            No active alerts matching selected filter criteria.
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div
              key={a._id || a.title}
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                a.severity === 'CRITICAL'
                  ? 'bg-rose-50/90 dark:bg-gradient-to-r dark:from-rose-950/40 dark:via-slate-900 dark:to-navy-950 border-rose-200 dark:border-rose-500/40 shadow-sm'
                  : a.severity === 'HIGH'
                  ? 'bg-amber-50/90 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-900 dark:to-navy-950 border-amber-200 dark:border-amber-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm'
              } ${a.isAcknowledged ? 'opacity-60' : ''}`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    a.severity === 'CRITICAL'
                      ? 'bg-rose-500 text-white'
                      : a.severity === 'HIGH'
                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                    {a.category}
                  </span>
                  {a.isAcknowledged && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Acknowledged
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{a.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">{a.message}</p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">Directive:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{a.recommendation}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {!a.isAcknowledged && (
                  <button
                    onClick={() => handleAcknowledge(a._id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-xs font-mono font-semibold transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {a.actionableLink && (
                  <Link
                    to={a.actionableLink}
                    className="px-3.5 py-1.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1 shadow-md"
                  >
                    <span>Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
