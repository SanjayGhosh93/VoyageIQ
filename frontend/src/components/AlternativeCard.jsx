// frontend/src/components/AlternativeCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, DollarSign, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

export const AlternativeCard = ({
  alternative,
  isSelected = false,
  onSelect,
  isRecommended = false
}) => {
  if (!alternative) return null;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
        isRecommended
          ? 'bg-amber-50/90 dark:bg-gradient-to-b dark:from-slate-900 dark:to-navy-950 border-amber-300 dark:border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm hover:border-ocean-500/30'
      }`}
    >
      {/* Header: Title & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <StatusBadge type="ranking" value={alternative.rankBadge || '#1 RECOMMENDED'} />
          <StatusBadge type="feasibility" value={alternative.feasibilityStatus || 'FEASIBLE'} />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1">
          {alternative.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {alternative.description}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Cost / MT</div>
            <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
              {formatCurrencyPerMT(alternative.costPerMT)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Total Landed</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {formatCurrency(alternative.totalLandedCost)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Demurrage Risk</div>
            <div className={`text-sm font-bold font-mono ${alternative.demurrageRiskScore > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {alternative.demurrageRiskScore}/100
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Total Cycle</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {alternative.totalVoyageDays || 19.5} Days
            </div>
          </div>
        </div>

        {/* Potential Savings Banner */}
        {alternative.potentialSavingUSD > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Potential Scenario Saving</span>
            </span>
            <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(alternative.potentialSavingUSD)}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Score: <strong className="text-slate-900 dark:text-white font-bold">{alternative.scores?.optimizationScore || 88}/100</strong>
        </div>

        {onSelect && (
          <button
            onClick={() => onSelect(alternative)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-ocean-600 hover:bg-ocean-500 text-white'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Select Alternative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AlternativeCard;
