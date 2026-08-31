// frontend/src/pages/MarketIntelPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Fuel, 
  Activity, 
  DollarSign, 
  Globe, 
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';
import { MarketTrendChart } from '../charts/MarketTrendChart';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { marketService } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const MarketIntelPage = () => {
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [vesselClass, setVesselClass] = useState('PANAMAX');
  const [days, setDays] = useState(365);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarket = async () => {
      setLoading(true);
      try {
        const [oRes, hRes] = await Promise.all([
          marketService.getOverview(),
          marketService.getHistory({ vesselClass, days })
        ]);
        if (oRes?.success) setOverview(oRes.data);
        if (hRes?.success) setHistory(hRes.data);
      } catch (err) {
        console.error('Market intelligence query failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarket();
  }, [vesselClass, days]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-ocean-400 uppercase tracking-widest">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL DRY BULK BENCHMARKS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Market Intelligence & Baltic Indices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking BDI, Capesize/Panamax earnings, bunker pricing, and macroeconomic trends
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Regime: <strong className="text-emerald-400 font-bold">BULLISH (+2.4%)</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading Baltic Exchange indices and 730-day historical time-series..." />
      ) : (
        <>
          {/* Baltic Indices Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {overview?.indices && Object.entries(overview.indices).map(([key, idx]) => (
              <div key={key} className="p-4 rounded-2xl glass-panel space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase truncate">{idx.name}</div>
                <div className="text-xl font-extrabold text-white font-mono">{idx.value}</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={idx.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                    {idx.change}
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase">{idx.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Historical Time-Series Interactive Chart */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Historical Freight & Index Dynamics (730 Days Window)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overlaying spot rates, moving averages, BDI movements, and bunker shocks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={vesselClass}
                  onChange={(e) => setVesselClass(e.target.value)}
                  className="glass-input rounded-xl px-3 py-1 text-xs text-white"
                >
                  <option value="CAPESIZE" className="bg-slate-900">Capesize</option>
                  <option value="PANAMAX" className="bg-slate-900">Panamax</option>
                  <option value="SUPRAMAX" className="bg-slate-900">Supramax</option>
                  <option value="HANDYSIZE" className="bg-slate-900">Handysize</option>
                </select>

                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="glass-input rounded-xl px-3 py-1 text-xs text-white font-mono"
                >
                  <option value={90} className="bg-slate-900">90 Days</option>
                  <option value={180} className="bg-slate-900">180 Days</option>
                  <option value={365} className="bg-slate-900">1 Year</option>
                  <option value={730} className="bg-slate-900">2 Years (730d)</option>
                </select>
              </div>
            </div>

            <MarketTrendChart data={history} height={340} />
          </div>

          {/* Bunker Prices Across Key Hubs & Benchmark Spot Rates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bunker Prices */}
            <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Bunker Fuel Prices by Marine Hub
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">USD / MT</span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {overview?.bunkerPrices?.map((b, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="font-sans font-semibold text-slate-200">{b.port}</span>
                    <div className="flex items-center gap-4">
                      <span>VLSFO: <strong className="text-purple-300 font-bold">${b.vlsfo}</strong></span>
                      <span>MGO: <strong className="text-slate-300 font-bold">${b.mgo}</strong></span>
                      <span className="text-emerald-400 font-semibold">{b.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Key Corridors */}
            <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Benchmark Key Corridors
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">SPOT $/MT</span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {overview?.freightSpotBenchmarks?.map((s, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="font-sans text-slate-300">{s.route}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold">${s.rateUSDPerMT.toFixed(2)}/MT</span>
                      <span className="text-emerald-400">{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketIntelPage;
