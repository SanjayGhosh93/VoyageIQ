// frontend/src/components/StatusBadge.jsx
import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const StatusBadge = ({ type = 'feasibility', value = 'FEASIBLE', size = 'sm' }) => {
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  // 1. Feasibility Badges
  if (type === 'feasibility') {
    if (value === 'FEASIBLE') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>FEASIBLE</span>
        </span>
      );
    }
    if (value === 'INFEASIBLE') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5" />
          <span>INFEASIBLE</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono ${sizeClasses}`}>
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>CONDITIONAL</span>
      </span>
    );
  }

  // 2. Risk Badges
  if (type === 'risk') {
    if (value === 'CRITICAL') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-mono ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>CRITICAL RISK</span>
        </span>
      );
    }
    if (value === 'HIGH') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono ${sizeClasses}`}>
          <span>HIGH RISK</span>
        </span>
      );
    }
    if (value === 'MODERATE') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-mono ${sizeClasses}`}>
          <span>MODERATE RISK</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono ${sizeClasses}`}>
        <span>LOW RISK</span>
      </span>
    );
  }

  // 3. Market Regime Badges
  if (type === 'regime') {
    if (value === 'BULLISH') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-mono ${sizeClasses}`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>BULLISH</span>
        </span>
      );
    }
    if (value === 'BEARISH') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-mono ${sizeClasses}`}>
          <TrendingDown className="w-3.5 h-3.5" />
          <span>BEARISH</span>
        </span>
      );
    }
    if (value === 'HIGH_VOLATILITY') {
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono ${sizeClasses}`}>
          <Activity className="w-3.5 h-3.5" />
          <span>HIGH VOLATILITY</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono ${sizeClasses}`}>
        <span>SIDEWAYS</span>
      </span>
    );
  }

  // 4. Ranking Badges
  if (value.includes('#1') || value.includes('RECOMMENDED')) {
    return (
      <span className={`inline-flex items-center gap-1 font-extrabold rounded-full bg-amber-400 text-slate-950 font-mono ${sizeClasses} shadow-md shadow-amber-400/20`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{value}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono ${sizeClasses}`}>
      <span>{value}</span>
    </span>
  );
};

export default StatusBadge;