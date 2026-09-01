// frontend/src/components/ConstraintViolationBanner.jsx
import React from 'react';
import { AlertCircle, ArrowDown, ShieldAlert } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const ConstraintViolationBanner = ({ 
  vesselClass = 'HANDYSIZE', 
  port = 'Visakhapatnam', 
  cargoParcelMT = 120000, 
  deadweightMT = 33600,
  constraintType = 'CARGO_CAPACITY_FAILURE' 
}) => {
  return (
    <div className="w-full bg-rose-950/40 border border-rose-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-2xl shadow-rose-950/50 space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
            Constraint Violation Detected
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-white font-mono">
            Direct Voyage Not Feasible
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            The proposed fixture for <span className="text-rose-300 font-bold">{vesselClass}</span> at <span className="text-slate-100 font-semibold">{port}</span> violates mandatory operational safety & navigational limits. The direct voyage cannot be executed.
          </p>
        </div>
      </div>

      {/* Failed Constraints Box */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-rose-400/80 uppercase tracking-wider">
          Failed Operational Constraints (1)
        </div>
        
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-900/30 border border-rose-500/30 text-xs font-mono text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            CARGO CAPACITY FAILURE: Cargo parcel ({formatNumber(cargoParcelMT)} MT) exceeds maximum deadweight capacity of {vesselClass} ({formatNumber(deadweightMT)} MT).
          </span>
        </div>
      </div>

      {/* AI Decision Engine Footer Prompt */}
      <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
        <ArrowDown className="w-4 h-4 animate-bounce" />
        <span>AI DECISION ENGINE: SMART ALTERNATIVES GENERATED BELOW</span>
      </div>
    </div>
  );
};

export default ConstraintViolationBanner;