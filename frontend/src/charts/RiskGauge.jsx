// frontend/src/charts/RiskGauge.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const RiskGauge = ({ score = 24, level, topContributors = [] }) => {
  // Score clamped between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, Number(score) || 0));

  // Dynamic color, icon, and level mapping based on score
  const getRiskConfig = (val) => {
    if (val >= 76) {
      return {
        level: level || 'CRITICAL',
        stroke: '#f43f5e',
        text: 'text-rose-400',
        bgBadge: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        icon: <Flame className="w-4 h-4 text-rose-400" />
      };
    }
    if (val >= 51) {
      return {
        level: level || 'HIGH',
        stroke: '#f59e0b',
        text: 'text-amber-400',
        bgBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
      };
    }
    if (val >= 26) {
      return {
        level: level || 'MODERATE',
        stroke: '#0ea5e9',
        text: 'text-sky-400',
        bgBadge: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
        icon: <ShieldAlert className="w-4 h-4 text-sky-400" />
      };
    }
    return {
      level: level || 'LOW',
      stroke: '#10b981',
      text: 'text-emerald-400',
      bgBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />
    };
  };

  const colorScheme = getRiskConfig(normalizedScore);

  // Circular gauge parameters (Semi-circle Arc)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Semi-circular gauge SVG */}
      <div className="relative w-64 h-36 flex items-center justify-center">
        <svg className="w-64 h-36" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#0ea5e9" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Track background */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={colorScheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute top-12 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-bold font-mono tracking-tight ${colorScheme.text}`}
          >
            {normalizedScore}
            <span className="text-sm font-normal text-slate-500 font-sans">/100</span>
          </motion.div>
          
          <div className={`mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${colorScheme.bgBadge}`}>
            {colorScheme.icon}
            <span>{colorScheme.level.toUpperCase()} RISK</span>
          </div>
        </div>
      </div>

      {/* Top Contributors Breakdown */}
      {topContributors && topContributors.length > 0 && (
        <div className="w-full mt-4 space-y-2 border-t border-slate-800/80 pt-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Top Risk Contributors
          </div>
          {topContributors.slice(0, 4).map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">{c.factor || c.name || 'Risk Factor'}</span>
              <span className="font-mono text-amber-400 font-bold">
                +{c.contribution ?? c.impact ?? 0} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskGauge;