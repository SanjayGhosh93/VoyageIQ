// frontend/src/components/EmptyState.jsx
import React from 'react';
import { Anchor } from 'lucide-react';

export const EmptyState = ({
  title = 'No Data Available',
  description = 'Destination berth draft or parameters are unavailable. Feasibility cannot be confirmed.',
  actionText,
  onAction
}) => {
  return (
    <div className="w-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 mb-3 shadow-inner">
        <Anchor className="w-8 h-8 text-sky-400" />
      </div>
      <h4 className="text-base font-bold text-white mb-1 font-mono tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold font-mono transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;