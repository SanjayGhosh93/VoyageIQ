// frontend/src/pages/VesselMatcherPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Sliders
} from 'lucide-react';
import { FailureAlertBox } from '../components/FailureAlertBox';
import { AlternativeCard } from '../components/AlternativeCard';
import { WhyDecisionSection } from '../components/WhyDecisionSection';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { feasibilityService } from '../services/api';
import { ORIGIN_PORTS, DESTINATION_PORTS, VESSEL_CLASSES, CARGO_TYPES } from '../utils/constants';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';
import { ConstraintViolationBanner } from '../components/ConstraintViolationBanner';

// Inside your feasibility check render block:
{isFeasible === false && (
  <ConstraintViolationBanner
    vesselClass="HANDYSIZE"
    port="Visakhapatnam"
    cargoParcelMT={120000}
    deadweightMT={33600}
  />
)}
export const VesselMatcherPage = () => {
  const [form, setForm] = useState({
    cargoQuantity: 120000,
    cargoType: 'Coking Coal',
    origin: 'Gladstone',
    destination: 'Haldia',
    vesselClass: 'CAPESIZE',
    priority: 'Balanced'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  const runFeasibilityCheck = async (params) => {
    setLoading(true);
    try {
      const res = await feasibilityService.checkFeasibility(params || form);
      if (res?.success) {
        setResult(res);
        if (res.recommendedAlternative) {
          setSelectedAlternative(res.recommendedAlternative);
        }
      }
    } catch (err) {
      console.error('Feasibility query failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runFeasibilityCheck();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runFeasibilityCheck(form);
  };

  const handleApplyPreset = (presetType) => {
    let preset = {};
    if (presetType === 'impossible') {
      preset = { cargoQuantity: 120000, cargoType: 'Coking Coal', origin: 'Gladstone', destination: 'Haldia', vesselClass: 'CAPESIZE', priority: 'Balanced' };
    } else if (presetType === 'possible') {
      preset = { cargoQuantity: 70000, cargoType: 'Coking Coal', origin: 'Gladstone', destination: 'Paradip', vesselClass: 'PANAMAX', priority: 'Balanced' };
    } else if (presetType === 'dhamra') {
      preset = { cargoQuantity: 120000, cargoType: 'Coking Coal', origin: 'Gladstone', destination: 'Dhamra', vesselClass: 'CAPESIZE', priority: 'Balanced' };
    }
    setForm(preset);
    runFeasibilityCheck(preset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            <Ship className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>SAIL MARITIME CONSTRAINT SOLVER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Vessel-Port Matcher & Alternative Generator
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Evaluates 10+ navigational constraints & computes multi-criteria alternative rankings
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('impossible')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Test Infeasible (Haldia Capesize)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('possible')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Feasible (Paradip Panamax)</span>
          </button>
        </div>
      </div>

      {/* Form Setup Card */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Voyage Parameters & Priority Mode</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Cargo Quantity */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Parcel (MT)</label>
            <input
              type="number"
              value={form.cargoQuantity}
              onChange={(e) => setForm({ ...form, cargoQuantity: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              step="5000"
              required
            />
          </div>

          {/* Cargo Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Type</label>
            <select
              value={form.cargoType}
              onChange={(e) => setForm({ ...form, cargoType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CARGO_TYPES.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Loading Port</label>
            <select
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {ORIGIN_PORTS.map((p) => (
                <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900">{p.label}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Discharge Port</label>
            <select
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {DESTINATION_PORTS.map((p) => (
                <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900">{p.label}</option>
              ))}
            </select>
          </div>

          {/* Vessel Class */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vessel Class</label>
            <select
              value={form.vesselClass}
              onChange={(e) => setForm({ ...form, vesselClass: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v.value} value={v.value} className="bg-white dark:bg-slate-900">{v.label}</option>
              ))}
            </select>
          </div>

          {/* Check Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHECK FEASIBILITY</span>
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <LoadingState message="Testing navigational drafts, LOA, beam, handling capabilities, and generating smart alternatives..." />
      ) : (
        result && (
          <div className="space-y-6">
            {/* Feasibility Outcome Banner */}
            {!result.isFeasible ? (
              <FailureAlertBox
                headline="DIRECT VOYAGE NOT FEASIBLE"
                failedConstraints={result.failedConstraints}
                warnings={result.warnings}
                destination={form.destination}
                vesselClass={form.vesselClass}
              />
            ) : (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                        FEASIBILITY ENGINE VERDICT
                      </div>
                      <h3 className="text-lg font-extrabold text-white">
                        Voyage Feasible & Compliant
                      </h3>
                    </div>
                  </div>
                  <StatusBadge type="feasibility" value="FEASIBLE" size="lg" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[10px]">Est. Landed Cost</span>
                    <span className="text-cyan-400 font-bold text-base">
                      {formatCurrencyPerMT(result.costEstimate?.costs?.costPerMT)}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[10px]">Total Landed</span>
                    <span className="text-white font-bold text-base">
                      {formatCurrency(result.costEstimate?.costs?.totalLandedCost)}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[10px]">Demurrage Risk</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {result.riskScore}/100 ({result.riskLevel})
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[10px]">Compatibility</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {result.compatibilityScore}/100
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Alternatives Section */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>SMART ALTERNATIVE GENERATOR</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Ranked Logistics Alternatives & Optimization Options
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Showing <strong className="text-slate-900 dark:text-white">{result.alternatives.length}</strong> calculated options
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.alternatives.map((alt, idx) => (
                    <AlternativeCard
                      key={alt.id || idx}
                      alternative={alt}
                      isRecommended={idx === 0}
                      isSelected={selectedAlternative?.id === alt.id}
                      onSelect={(opt) => setSelectedAlternative(opt)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Explainable AI "Why This Decision?" Section */}
            {result.aiRecommendation && (
              <WhyDecisionSection recommendation={result.aiRecommendation} />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default VesselMatcherPage;