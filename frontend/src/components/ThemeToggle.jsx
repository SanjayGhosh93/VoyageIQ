// frontend/src/components/ThemeToggle.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ showLabel = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative group p-2 rounded-xl border transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ocean-400 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800/80 shadow-md shadow-amber-500/5'
          : 'bg-white/90 border-slate-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-300 hover:bg-slate-50 shadow-md shadow-indigo-500/10'
      } ${className}`}
      title={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
      aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun-icon"
              initial={{ y: -16, opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: 16, opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-center text-amber-400"
            >
              <Sun className="w-4 h-4 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-icon"
              initial={{ y: -16, opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: 16, opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-center text-indigo-600"
            >
              <Moon className="w-4 h-4 text-indigo-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-mono font-bold tracking-wider uppercase transition-colors">
          {isDark ? 'Day Mode' : 'Night Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
