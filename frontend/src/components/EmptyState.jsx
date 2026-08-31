// frontend/src/components/EmptyState.jsx
import React from 'react';
import { Anchor, AlertCircle } from 'lucide-react';

export const EmptyState = ({
  title = 'No Data Available',
  description = 'Destination berth draft or parameters are unavailable. Feasibility cannot be confirmed.',
  actionText,
  onAction
}) => {
  return (
    <div className="w-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-slate-800">
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mb-3">
        <Anchor className="w-8 h-8 text-slate-500" />
      </div>
      <h4 className="text-base font-bold text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-semibold font-mono transition-colors shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
