// frontend/src/components/AlternativeCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

// Safe fallback formatters in case utility imports fail
const defaultFormatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val || 0);
};

const defaultFormatCurrencyPerMT = (val) => {
  return `${defaultFormatCurrency(val)}/MT`;
};

let formatCurrency = defaultFormatCurrency;
let formatCurrencyPerMT = defaultFormatCurrencyPerMT;

try {
  const formatters = require('../utils/formatters');
  if (formatters.formatCurrency) formatCurrency = formatters.formatCurrency;
  if (formatters.formatCurrencyPerMT) formatCurrencyPerMT = formatters.formatCurrencyPerMT;
} catch (e) {
  // Utility not found, falling back to inline default formatters
}

export const AlternativeCard = ({
  alternative,
  isSelected = false,
  onSelect,
  isRecommended = false
}) => {
  if (!alternative) return null;

  // Property mapping normalization to support various backend API schemas
  const title = alternative.title || alternative.name || alternative.routeTitle || 'Alternative Route Option';
  const description = alternative.description || alternative.summary || alternative.notes || 'Alternative operational route configuration.';
  const costPerMT = alternative.costPerMT ?? alternative.freightRatePerMT ?? alternative.ratePerMT ?? 0;
  const totalLandedCost = alternative.totalLandedCost ?? alternative.landedCost ?? alternative.totalCost ?? 0;
  const demurrageRiskScore = alternative.demurrageRiskScore ?? alternative.riskScore ?? alternative.demurrageRisk ?? 25;
  const totalVoyageDays = alternative.totalVoyageDays ?? alternative.voyageDays ?? alternative.durationDays ?? 19.5;
  const potentialSavingUSD = alternative.potentialSavingUSD ?? alternative.savingsUSD ?? alternative.costSavings ?? 0;
  const optimizationScore = alternative.scores?.optimizationScore ?? alternative.optimizationScore ?? alternative.score ?? 88;

  const rankBadge = alternative.rankBadge || (isRecommended ? '#1 RECOMMENDED' : 'OPTION');
  const feasibilityStatus = alternative.feasibilityStatus || (alternative.isFeasible !== false ? 'FEASIBLE font-bold' : 'UNFEASIBLE');

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
        isRecommended
          ? 'bg-amber-50/90 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-amber-300 dark:border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/30'
      }`}
    >
      {/* Header: Title & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <StatusBadge type="ranking" value={rankBadge} />
          <StatusBadge type="feasibility" value={feasibilityStatus} />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1">
          {title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Cost / MT</div>
            <div className="text-base font-extrabold text-sky-600 dark:text-sky-400 font-mono">
              {formatCurrencyPerMT(costPerMT)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Total Landed</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {formatCurrency(totalLandedCost)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Demurrage Risk</div>
            <div className={`text-sm font-bold font-mono ${demurrageRiskScore > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {demurrageRiskScore}/100
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Total Cycle</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {totalVoyageDays} Days
            </div>
          </div>
        </div>

        {/* Potential Savings Banner */}
        {potentialSavingUSD > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Potential Scenario Saving</span>
            </span>
            <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(potentialSavingUSD)}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Score: <strong className="text-slate-900 dark:text-white font-bold">{optimizationScore}/100</strong>
        </div>

        {onSelect && (
          <button
            onClick={() => onSelect(alternative)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20'
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