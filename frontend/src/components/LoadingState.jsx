// frontend/src/components/LoadingState.jsx
import React from 'react';
import { Ship } from 'lucide-react';

export const LoadingState = ({ message = 'Analyzing maritime constraints & calculating optimal freight routes...' }) => {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-sky-500/20 border-t-sky-400 dark:border-sky-500/20 dark:border-t-sky-400 animate-spin flex items-center justify-center" />
        <Ship className="w-6 h-6 text-sky-500 dark:text-sky-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <div className="text-center max-w-sm">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{message}</div>
        <div className="text-xs text-slate-500 font-mono mt-1">OceanCharter AI Engine Active</div>
      </div>
    </div>
  );
};

export default LoadingState;