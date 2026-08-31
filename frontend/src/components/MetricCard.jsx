// frontend/src/components/MetricCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral', // 'up', 'down', 'neutral'
  icon: Icon,
  badgeText,
  badgeColor = 'ocean',
  isSimulated = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="relative p-4 rounded-2xl glass-panel hover:border-ocean-500/30 transition-all flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/20"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-xl bg-ocean-500/10 border border-ocean-500/20 text-ocean-600 dark:text-ocean-400 group-hover:bg-ocean-500/20 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        </div>

        {badgeText && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">{value}</div>
        {change && (
          <div
            className={`flex items-center gap-0.5 text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
              trend === 'up'
                ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                : trend === 'down'
                ? 'text-rose-500 dark:text-rose-400 bg-rose-500/10'
                : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Subtitle / Context */}
      {subtitle && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</div>}

      {/* Mandatory Simulated Tag */}
      {isSimulated && (
        <div className="mt-2 text-[9px] uppercase tracking-wider text-slate-600 font-mono flex justify-end">
          ILLUSTRATIVE SIMULATION
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
