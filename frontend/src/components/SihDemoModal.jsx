// frontend/src/components/SihDemoModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Ship, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

const DEMO_STEPS = [
  { id: 1, name: 'Market Intelligence & Rates' },
  { id: 2, name: 'Predictive Freight Forecast' },
  { id: 3, name: 'Vessel Envelope Inspection' },
  { id: 4, name: 'Destination Port Constraints' },
  { id: 5, name: 'Failure Detection & Diagnostics' },
  { id: 6, name: 'Smart Alternative Generation' },
  { id: 7, name: 'Landed Cost Optimization' },
  { id: 8, name: 'Demurrage Risk Evaluation' },
  { id: 9, name: 'Multi-Criteria Ranking' },
  { id: 10, name: 'Final Explainable Recommendation' }
];

export const SihDemoModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setCurrentStep(1);
      setIsRunning(true);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (isRunning && currentStep < 10) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);
    } else if (currentStep >= 10) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-gradient-to-b from-slate-900 to-navy-950 border border-ocean-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-navy-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                SIH 2026 BENCHMARK DEMONSTRATION
              </div>
              <h2 className="text-base font-extrabold text-white">
                OceanCharter AI Decision Simulation Flow
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsRunning(true);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Re-run Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] gap-2">
            {DEMO_STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                    currentStep > s.id
                      ? 'bg-emerald-500 text-slate-950'
                      : currentStep === s.id
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {currentStep > s.id ? '✓' : s.id}
                </div>
                <span className={`text-[11px] font-medium truncate ${currentStep >= s.id ? 'text-slate-200' : 'text-slate-500'}`}>
                  {s.name}
                </span>
                {s.id !== 10 && <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
          {/* Baseline Scenario Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Consignment</span>
              <span className="text-sm font-bold text-white">120,000 MT Coking Coal</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Corridor</span>
              <span className="text-sm font-bold text-white">Gladstone → Haldia</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Proposed Vessel</span>
              <span className="text-sm font-bold text-amber-400">Capesize (180k DWT)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Consumer</span>
              <span className="text-sm font-bold text-cyan-400">SAIL IISCO / Durgapur</span>
            </div>
          </div>

          {/* Step 5+ Result: Failure Diagnostics */}
          {currentStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs uppercase">
                  <AlertOctagon className="w-5 h-5" />
                  <span>VOYAGE ANALYSIS: DIRECT VOYAGE INFEASIBLE</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold">
                  REJECTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-200">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <strong className="block text-rose-300">✕ Draft Incompatibility</strong>
                  Vessel draft 17.5m exceeds Haldia maximum permissible berth draft 8.5m by 9.0m.
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <strong className="block text-rose-300">✕ LOA Restriction</strong>
                  Capesize LOA (285m) exceeds Haldia lock entrance limit (230m).
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6+ Result: Smart Alternatives Breakdown */}
          {currentStep >= 6 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
                <span>SMART ALTERNATIVES GENERATED & EVALUATED</span>
                <span className="text-ocean-400">Multi-Objective Optimization</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Option 1: Paradip */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 relative flex flex-col justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold font-mono text-[10px] w-fit mb-2">
                    #1 RECOMMENDED
                  </span>
                  <div className="text-sm font-bold text-white mb-1">Paradip Port</div>
                  <div className="text-xs text-slate-400 mb-3">Direct discharge via Panamax / rail evacuation</div>
                  <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">FEASIBLE</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cost / MT:</span>
                      <span className="text-white font-bold">$27.31</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Demurrage Risk:</span>
                      <span className="text-emerald-400 font-bold">24/100 (LOW)</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Dhamra */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative flex flex-col justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold font-mono text-[10px] w-fit mb-2">
                    #2 ALTERNATIVE
                  </span>
                  <div className="text-sm font-bold text-white mb-1">Dhamra Port</div>
                  <div className="text-xs text-slate-400 mb-3">Capesize direct discharge at deep-draft berth</div>
                  <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">FEASIBLE</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cost / MT:</span>
                      <span className="text-white font-bold">$23.03</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Demurrage Risk:</span>
                      <span className="text-cyan-400 font-bold">31/100 (MOD)</span>
                    </div>
                  </div>
                </div>

                {/* Option 3: Sandheads */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative flex flex-col justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold font-mono text-[10px] w-fit mb-2">
                    #3 BACKUP
                  </span>
                  <div className="text-sm font-bold text-white mb-1">Sandheads Lightering</div>
                  <div className="text-xs text-slate-400 mb-3">Offshore barge transshipment to Haldia dock</div>
                  <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-amber-400 font-bold">CONDITIONAL</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cost / MT:</span>
                      <span className="text-white font-bold">$26.13</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Demurrage Risk:</span>
                      <span className="text-amber-400 font-bold">48/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 10: Final Recommendation Summary */}
          {currentStep >= 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-navy-950 border border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>FINAL AI CHARTERING RECOMMENDATION</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-emerald-400">
                  ESTIMATED BENEFIT: +$218,500
                </div>
              </div>

              <div className="text-sm text-slate-200 leading-relaxed font-medium">
                Fixture <strong className="text-white">Panamax vessel</strong> on <strong className="text-white">Time Charter</strong> basis for discharge at <strong className="text-white">Paradip Port</strong>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Draught & LOA 100% compliant with port channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Rapid rail dispatch minimizes demurrage risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bullish market regime locked at current base rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Eliminates barge lightering double handling fees</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-navy-900/60 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 font-mono">
            ILLUSTRATIVE SIMULATION • SIH 2026 PROTOTYPE
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold font-mono transition-colors shadow-lg"
          >
            Close Demonstration
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SihDemoModal;
