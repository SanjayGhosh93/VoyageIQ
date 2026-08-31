// frontend/src/pages/IdleManagementPage.jsx
import React, { useState } from 'react';
import { Clock, Ship, Sparkles, Layers, ArrowRight, ShieldCheck, BarChart2, Activity } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { formatCurrency } from '../utils/formatters';

export const IdleManagementPage = () => {
  const [cycleParams, setCycleParams] = useState({
    loadingDays: 2.5,
    sailingDays: 15.7,
    queueDays: 2.5,
    berthingDays: 0.5,
    dischargeDays: 2.0,
    ballastReturnDays: 14.5,
    dailyHireRate: 23000
  });

  const totalCycleDays = Number((
    cycleParams.loadingDays +
    cycleParams.sailingDays +
    cycleParams.queueDays +
    cycleParams.berthingDays +
    cycleParams.dischargeDays +
    cycleParams.ballastReturnDays
  ).toFixed(1));

  // Idle days: queue delay + non-revenue repositioning ballast days
  const idleDays = Number((cycleParams.queueDays + (cycleParams.ballastReturnDays * 0.4)).toFixed(1));
  const idleCost = Math.round(idleDays * cycleParams.dailyHireRate);

  let idleLevel = 'LOW IDLE';
  let badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (idleDays > 10) {
    idleLevel = 'HIGH IDLE';
    badgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  } else if (idleDays > 6) {
    idleLevel = 'MEDIUM IDLE';
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-ocean-400 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>SAIL FLEET CYCLE & POSITIONING OPTIMIZER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Idle Vessel Management & Voyage Turnaround
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full round-trip voyage duration decomposition, ballast leg minimization, and coastal triangulation
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${badgeColor}`}>
          {idleLevel} ({idleDays} Idle Days)
        </div>
      </div>

      {/* Cycle Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Round-Trip Cycle"
          value={`${totalCycleDays} Days`}
          subtitle="Loading to Ballast Return"
          badgeText="FULL CYCLE"
        />
        <MetricCard
          title="Estimated Idle Days"
          value={`${idleDays} Days`}
          subtitle="Queue + Ballast Inefficiencies"
          badgeText="IDLE DURATION"
        />
        <MetricCard
          title="Idle Capital Exposure"
          value={formatCurrency(idleCost)}
          subtitle={`@ $${cycleParams.dailyHireRate.toLocaleString()}/Day Hire`}
          badgeText="OPPORTUNITY COST"
        />
        <MetricCard
          title="Triangulation Saving"
          value="+$64,200"
          subtitle="With Coastal Return Cargo"
          badgeText="POTENTIAL"
        />
      </div>

      {/* Breakdown Decomposition Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Round-Trip Duration Components (Days)
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">Total: {totalCycleDays}d</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Loading */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">1. Origin Port Loading Time:</span>
                <span className="text-white font-bold">{cycleParams.loadingDays} Days</span>
              </div>
              <input
                type="range" min="1" max="6" step="0.5"
                value={cycleParams.loadingDays}
                onChange={(e) => setCycleParams({ ...cycleParams, loadingDays: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sailing */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">2. Loaded Ocean Transit:</span>
                <span className="text-white font-bold">{cycleParams.sailingDays} Days</span>
              </div>
              <input
                type="range" min="10" max="25" step="0.5"
                value={cycleParams.sailingDays}
                onChange={(e) => setCycleParams({ ...cycleParams, sailingDays: Number(e.target.value) })}
                className="w-full accent-ocean-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Queue */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">3. Destination Port Queue:</span>
                <span className="text-amber-400 font-bold">{cycleParams.queueDays} Days</span>
              </div>
              <input
                type="range" min="0" max="10" step="0.5"
                value={cycleParams.queueDays}
                onChange={(e) => setCycleParams({ ...cycleParams, queueDays: Number(e.target.value) })}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Discharge */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">4. Berth Discharge Duration:</span>
                <span className="text-white font-bold">{cycleParams.dischargeDays} Days</span>
              </div>
              <input
                type="range" min="1" max="5" step="0.5"
                value={cycleParams.dischargeDays}
                onChange={(e) => setCycleParams({ ...cycleParams, dischargeDays: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Return */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">5. Empty Ballast Return Leg:</span>
                <span className="text-purple-300 font-bold">{cycleParams.ballastReturnDays} Days</span>
              </div>
              <input
                type="range" min="8" max="22" step="0.5"
                value={cycleParams.ballastReturnDays}
                onChange={(e) => setCycleParams({ ...cycleParams, ballastReturnDays: Number(e.target.value) })}
                className="w-full accent-purple-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Recommendations for Idle Minimization */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-navy-950 border border-ocean-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Fleet Triangulation & Scheduling Directives
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-amber-400">1. Coastal Cargo Triangulation</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Reposition vessel from Paradip to Dhamra / Gopalpur to pick up coastal iron ore or pellet cargo back toward Southeast Asia instead of empty ballast.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-cyan-400">2. Pre-Arrival Virtual Berthing</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Slow steam (11.5 knots vs 13.5 knots) during known 48hr port queues to save $22,400 in fuel while arriving just in time for the berthing slot.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">3. Scheduled Drydock & Maintenance Sync</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Align vessel periodic surveys during monsoon lulls to avoid high demurrage queue intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleManagementPage;
