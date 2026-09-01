// frontend/src/pages/CalculatorPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  Fuel, 
  Clock, 
  Anchor, 
  Sliders, 
  Layers,
  PieChart as PieIcon,
  BarChart2,
  FileSpreadsheet
} from 'lucide-react';
import { CostBreakdownChart } from '../charts/CostBreakdownChart';
import { SensitivityChart } from '../charts/SensitivityChart';
import { MetricCard } from '../components/MetricCard';
import { calculatorService } from '../services/api';
import { ORIGIN_PORTS, DESTINATION_PORTS, VESSEL_CLASSES, CARGO_TYPES, CONTRACT_TYPES } from '../utils/constants';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

export const CalculatorPage = () => {
  const [params, setParams] = useState({
    cargoQuantity: 70000,
    cargoType: 'Coking Coal',
    origin: 'Gladstone',
    destination: 'Paradip',
    vesselClass: 'PANAMAX',
    contractType: 'Spot Voyage',
    freightRate: 18.42,
    fuelPrice: 620,
    demurrageRate: 20000,
    expectedWaiting: 2.5,
    handlingRate: 1500
  });

  // What-If Sliders state
  const [fuelDelta, setFuelDelta] = useState(0); // -15% to +15%
  const [freightDelta, setFreightDelta] = useState(0); // -10% to +10%
  const [waitingDaysOverride, setWaitingDaysOverride] = useState(2.5); // 0 to 10 days

  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateCosts = async () => {
    setLoading(true);
    try {
      const res = await calculatorService.calculateCost({
        ...params,
        fuelPriceDeltaPct: fuelDelta,
        freightRateDeltaPct: freightDelta,
        overrideWaitingDays: waitingDaysOverride
      });
      if (res?.success) {
        setCostData(res.data);
      }
    } catch (err) {
      console.error('Cost calculation query failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateCosts();
  }, [fuelDelta, freightDelta, waitingDaysOverride, params]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>SAIL TOTAL LANDED COST & WHAT-IF ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Chartering Cost & Sensitivity Simulator
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Live evaluation of ocean freight, bunker fuel burn, port dues, stevedoring, and demurrage exposure
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Current Landed Benchmark</div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
            {formatCurrencyPerMT(costData?.costs?.costPerMT || 27.31)}
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, What-If Sliders on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Form Inputs */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Chartering Voyage Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Quantity (MT)</label>
              <input
                type="number"
                value={params.cargoQuantity}
                onChange={(e) => setParams({ ...params, cargoQuantity: Number(e.target.value) })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                step="5000"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contract Type</label>
              <select
                value={params.contractType}
                onChange={(e) => setParams({ ...params, contractType: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {CONTRACT_TYPES.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Origin Port</label>
              <select
                value={params.origin}
                onChange={(e) => setParams({ ...params, origin: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {ORIGIN_PORTS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Destination Port</label>
              <select
                value={params.destination}
                onChange={(e) => setParams({ ...params, destination: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {DESTINATION_PORTS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vessel Class</label>
              <select
                value={params.vesselClass}
                onChange={(e) => setParams({ ...params, vesselClass: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {VESSEL_CLASSES.map((v) => (
                  <option key={v.value} value={v.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Base Freight ($/MT)</label>
              <input
                type="number"
                value={params.freightRate}
                onChange={(e) => setParams({ ...params, freightRate: Number(e.target.value) })}
                className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Interactive What-If Sliders */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                What-If Live Sensitivity Sliders
              </h3>
            </div>
            <button
              onClick={() => {
                setFuelDelta(0);
                setFreightDelta(0);
                setWaitingDaysOverride(2.5);
              }}
              className="text-[11px] text-sky-400 hover:underline font-mono cursor-pointer"
            >
              Reset Sliders
            </button>
          </div>

          {/* Slider 1: Bunker Fuel Delta */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-purple-400" />
                <span>Bunker Fuel Price Shift:</span>
              </span>
              <strong className={`font-bold ${fuelDelta > 0 ? 'text-rose-400' : fuelDelta < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {fuelDelta > 0 ? `+${fuelDelta}%` : `${fuelDelta}%`}
              </strong>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={fuelDelta}
              onChange={(e) => setFuelDelta(Number(e.target.value))}
              className="w-full accent-purple-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-15% (Deflation)</span>
              <span>Base ($620/MT)</span>
              <span>+15% (Surge)</span>
            </div>
          </div>

          {/* Slider 2: Spot Freight Delta */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>Freight Rate Fluctuation:</span>
              </span>
              <strong className={`font-bold ${freightDelta > 0 ? 'text-rose-400' : freightDelta < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {freightDelta > 0 ? `+${freightDelta}%` : `${freightDelta}%`}
              </strong>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={freightDelta}
              onChange={(e) => setFreightDelta(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10%</span>
              <span>Base ($18.42/MT)</span>
              <span>+10%</span>
            </div>
          </div>

          {/* Slider 3: Port Waiting Days */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Port Waiting Congestion:</span>
              </span>
              <strong className="text-amber-400 font-bold">
                {waitingDaysOverride} Days
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={waitingDaysOverride}
              onChange={(e) => setWaitingDaysOverride(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 Days (Direct)</span>
              <span>2.5d (Normal)</span>
              <span>10 Days (Critical)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Output Results Grid */}
      {costData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Landed Cost"
              value={formatCurrency(costData.costs.totalLandedCost)}
              subtitle={`Landed at ${params.destination}`}
              badgeText="TOTAL OUTLAY"
            />
            <MetricCard
              title="Landed Cost per MT"
              value={formatCurrencyPerMT(costData.costs.costPerMT)}
              subtitle={`For ${params.cargoQuantity.toLocaleString()} MT`}
              badgeText="PER MT"
            />
            <MetricCard
              title="Ocean Freight Outlay"
              value={formatCurrency(costData.costs.oceanFreightCost)}
              subtitle={`@ $${costData.ratesUsed.freightRatePerMT.toFixed(2)}/MT`}
              badgeText="FREIGHT"
            />
            <MetricCard
              title="Demurrage Exposure"
              value={formatCurrency(costData.costs.expectedDemurrageCost)}
              subtitle={`${Math.max(0, costData.waitingDays - 2.0).toFixed(1)} excess laytime days`}
              trend={costData.costs.expectedDemurrageCost > 0 ? 'down' : 'neutral'}
              badgeText="PENALTY RISK"
            />
          </div>

          {/* Detailed Cost Breakdown & Sensitivity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Cols: Cost Breakdown Donut Chart */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Landed Cost Component Breakdown
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">SIMULATION</span>
              </div>
              <CostBreakdownChart breakdown={costData.breakdown} height={280} />
            </div>

            {/* Right 6 Cols: Sensitivity Bar Chart */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Macro Sensitivity Comparison
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">STRESS TEST</span>
              </div>
              <SensitivityChart baseCost={costData.costs.totalLandedCost} height={280} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculatorPage;