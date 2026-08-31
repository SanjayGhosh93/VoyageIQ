// frontend/src/components/FailureAlertBox.jsx
import React from 'react';
import { AlertOctagon, XCircle, ArrowDownCircle, ShieldAlert } from 'lucide-react';

export const FailureAlertBox = ({
  headline = 'DIRECT VOYAGE NOT FEASIBLE',
  failedConstraints = [],
  warnings = [],
  destination = 'Haldia',
  vesselClass = 'CAPESIZE'
}) => {
  return (
    <div className="p-5 rounded-2xl bg-rose-50/95 dark:bg-gradient-to-b dark:from-rose-950/40 dark:to-slate-900 border border-rose-200 dark:border-rose-500/40 shadow-xl relative overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-400">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            CONSTRAINT VIOLATION DETECTED
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {headline}
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
        The proposed fixture for <strong className="text-slate-900 dark:text-white font-bold">{vesselClass}</strong> at <strong className="text-slate-900 dark:text-white font-bold">{destination}</strong> violates mandatory operational safety & navigational limits. The direct voyage cannot be executed.
      </p>

      {/* Failed Constraints List */}
      {failedConstraints.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
            Failed Operational Constraints ({failedConstraints.length})
          </div>
          {failedConstraints.map((fail, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-900 dark:text-rose-200 shadow-sm"
            >
              <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-snug">{fail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Secondary Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1.5 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            Operational Advisories ({warnings.length})
          </div>
          {warnings.map((warn, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{warn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Prompt to alternatives */}
      <div className="pt-3 border-t border-rose-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-ocean-600 dark:text-ocean-400 font-semibold font-mono">
          <ArrowDownCircle className="w-4 h-4 text-ocean-500 dark:text-ocean-400 animate-bounce" />
          <span>AI DECISION ENGINE: SMART ALTERNATIVES GENERATED BELOW</span>
        </div>
      </div>
    </div>
  );
};

export default FailureAlertBox;
