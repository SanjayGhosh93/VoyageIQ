// frontend/src/components/Footer.jsx
import React from 'react';
import { APP_CONFIG } from '../utils/constants';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl py-3.5 px-6 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Organization & PS ID */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white font-mono">
            <img src="/app-logo.png" alt="Logo" className="w-4 h-4 object-contain" />
            <span>OCEANCHARTER AI</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-cyan-300 font-mono text-[11px] font-bold">
            SIH 2026: {APP_CONFIG.problemId}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
            Ministry of Steel • Steel Authority of India Limited (SAIL)
          </span>
        </div>

        {/* Right: Operational Status & System Signature */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Dispatch Engine Active</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>© 2026 SAIL Logistics Control Tower</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;