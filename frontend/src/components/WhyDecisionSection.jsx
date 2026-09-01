// frontend/src/components/WhyDecisionSection.jsx
import React from 'react';
import { 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const WhyDecisionSection = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-sky-500/30 shadow-xl space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>EXPLAINABLE AI REASONING (XAI)</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Why This Decision?
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-mono font-bold">
            Confidence: {Math.round((recommendation.confidenceScore || 0.94) * 100)}%
          </div>
        </div>
      </div>

      {/* 5 Core Justification Points */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          Decision Justification Breakdown
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {recommendation.whyReasons?.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability Matrix Grid */}
      {recommendation.explainabilityMatrix && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Verification Matrix
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {recommendation.explainabilityMatrix.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm"
              >
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{item.factor}</div>
                <div className="my-1 text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center justify-between">
                  <span>{item.status}</span>
                  {item.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {recommendation.actionSteps && (
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/20">
          <div className="text-xs font-bold text-sky-700 dark:text-sky-300 uppercase font-mono tracking-wider mb-2">
            Recommended Action Plan
          </div>
          <div className="space-y-2">
            {recommendation.actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyDecisionSection;