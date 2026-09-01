// frontend/src/pages/ForecastPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Sliders,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { FreightForecastChart } from '../charts/FreightForecastChart';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard } from '../components/MetricCard';
import { LoadingState } from '../components/LoadingState';
import { forecastService } from '../services/api';
import { ORIGIN_PORTS, DESTINATION_PORTS, VESSEL_CLASSES, CARGO_TYPES, HORIZON_OPTIONS } from '../utils/constants';
import { formatCurrencyPerMT, formatPercent } from '../utils/formatters';

export const ForecastPage = () => {
  const [form, setForm] = useState({
    origin: 'Gladstone',
    destination: 'Paradip',
    vesselClass: 'PANAMAX',
    cargoType: 'Coking Coal',
    cargoQuantity: 70000,
    horizonDays: 30
  });

  const [forecastResult, setForecastResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async (params) => {
    setLoading(true);
    try {
      const res = await forecastService.getForecast(params || form);
      if (res?.success) {
        setForecastResult(res.data);
      }
    } catch (err) {
      console.error('Forecast engine query failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const handleRunForecast = (e) => {
    e.preventDefault();
    fetchForecast(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>SAIL FREIGHT INTELLIGENCE ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Predictive Freight Forecasting & Time Series
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Pure JavaScript EMA20 / EMA50 algorithmic regression & horizon trajectory forecasting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="regime" value={forecastResult?.marketRegime || 'BULLISH'} size="lg" />
        </div>
      </div>

      {/* Inputs Form Bar */}
      <form onSubmit={handleRunForecast} className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Forecast Parameters & Horizon Configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Origin */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Loading Origin</label>
            <select
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              {ORIGIN_PORTS.map((p) => (
                <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{p.label}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Discharge Port</label>
            <select
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              {DESTINATION_PORTS.map((p) => (
                <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{p.label}</option>
              ))}
            </select>
          </div>

          {/* Vessel Class */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vessel Class</label>
            <select
              value={form.vesselClass}
              onChange={(e) => setForm({ ...form, vesselClass: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v.value} value={v.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{v.label}</option>
              ))}
            </select>
          </div>

          {/* Cargo Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Type</label>
            <select
              value={form.cargoType}
              onChange={(e) => setForm({ ...form, cargoType: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              {CARGO_TYPES.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Horizon Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Forecast Horizon</label>
            <select
              value={form.horizonDays}
              onChange={(e) => setForm({ ...form, horizonDays: Number(e.target.value) })}
              className="w-full rounded-xl px-3 py-2 text-xs text-amber-600 dark:text-amber-400 font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              {HORIZON_OPTIONS.map((h) => (
                <option key={h.value} value={h.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{h.label}</option>
              ))}
            </select>
          </div>

          {/* Run Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Forecast</span>
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <LoadingState message="Executing time-series regression and confidence band calculations..." />
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Current Spot Freight"
              value={formatCurrencyPerMT(forecastResult?.currentRate || 18.42)}
              subtitle={`${form.origin} → ${form.destination}`}
              badgeText="CURRENT RATE"
            />
            <MetricCard
              title={`${form.horizonDays}-Day Projected Rate`}
              value={formatCurrencyPerMT(forecastResult?.projectedRate || 19.93)}
              change={formatPercent(forecastResult?.percentageChange || 8.2)}
              trend={forecastResult?.percentageChange >= 0 ? 'up' : 'down'}
              subtitle="Mean Forecast Value"
              badgeText="PREDICTION"
            />
            <MetricCard
              title="Normalized Volatility"
              value={`${forecastResult?.volatility || 14.2}%`}
              subtitle="30-Day Rolling Std Dev"
              badgeText="MARKET RISK"
            />
            <MetricCard
              title="AI Recommended Fixture"
              value={forecastResult?.recommendedContract || 'Time Charter'}
              subtitle="Strategic Procurement Mode"
              badgeText="RECOMMENDED"
            />
          </div>

          {/* Interactive Recharts Forecast Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Trajectory & Confidence Envelope ({form.origin} → {form.destination})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Showing 30 days history + {form.horizonDays} days projected forward with 95% confidence bands
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  EMA 20: ${forecastResult?.ema20}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  EMA 50: ${forecastResult?.ema50}
                </span>
              </div>
            </div>

            <FreightForecastChart
              data={forecastResult?.chartData}
              currentRate={forecastResult?.currentRate}
              height={380}
            />
          </div>

          {/* Strategic Decision & Regime Logic Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Algorithmic Contract Strategy Recommendation
                </h3>
              </div>
              <StatusBadge type="regime" value={forecastResult?.marketRegime || 'BULLISH'} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              <strong className="text-white block mb-1 text-sm font-mono">
                Decision Directive: {forecastResult?.recommendedContract}
              </strong>
              {forecastResult?.reasoning}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block uppercase text-[10px]">EMA 20 Differential</span>
                <span className="text-emerald-400 font-bold text-sm">
                  +{((((forecastResult?.ema20 || 18.42) - (forecastResult?.ema50 || 17.02)) / (forecastResult?.ema50 || 17.02)) * 100).toFixed(1)}% vs EMA50
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block uppercase text-[10px]">Model Confidence</span>
                <span className="text-white font-bold text-sm">
                  {Math.round((forecastResult?.confidenceScore || 0.91) * 100)}% Confidence
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block uppercase text-[10px]">Data Quality</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {forecastResult?.dataQuality || 'SIMULATED'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForecastPage;