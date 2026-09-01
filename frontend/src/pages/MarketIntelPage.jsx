// frontend/src/pages/MarketIntelPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Fuel, 
  Activity, 
  Globe, 
  Database,
  Search
} from 'lucide-react';
import { MarketTrendChart } from '../charts/MarketTrendChart';
import { LoadingState } from '../components/LoadingState';
import { marketService } from '../services/api';

export function MarketIntelPage() {
  // Baltic Market Overview & History state
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [vesselClass, setVesselClass] = useState('PANAMAX');
  const [days, setDays] = useState(365);

  // Cargo Dataset (MySQL) state
  const [cargoData, setCargoData] = useState([]);
  const [cargoSearchTerm, setCargoSearchTerm] = useState('');

  // Main Loading & Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [oRes, hRes, cRes] = await Promise.allSettled([
          marketService.getOverview(),
          marketService.getHistory({ vesselClass, days }),
          marketService.getCargoHistory()
        ]);

        if (oRes.status === 'fulfilled' && oRes.value?.success) {
          setOverview(oRes.value.data);
        }
        if (hRes.status === 'fulfilled' && hRes.value?.success) {
          setHistory(hRes.value.data);
        }
        if (cRes.status === 'fulfilled' && cRes.value?.success) {
          setCargoData(cRes.value.data);
        }
      } catch (err) {
        console.error('Market intelligence query failed', err);
        setError('Failed to fetch market datasets.');
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, [vesselClass, days]);

  // Filter MySQL Cargo dataset
  const filteredCargoData = cargoData.filter(
    (row) =>
      row.item?.toLowerCase().includes(cargoSearchTerm.toLowerCase()) ||
      row.year?.toString().includes(cargoSearchTerm)
  );

  const totalCargoVolume = cargoData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalBulkCarrier = cargoData.reduce((acc, curr) => acc + (Number(curr.dry_cargo_bulk_carrier) || 0), 0);
  const totalTanker = cargoData.reduce((acc, curr) => acc + (Number(curr.oil_tanker) || 0), 0);

  return (
    <div className="space-y-8 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-navy-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL DRY BULK BENCHMARKS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Market Intelligence & Cargo Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking Baltic indices, freight rates, bunker pricing, and MySQL commodity movements
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Regime: <strong className="text-emerald-400 font-bold">BULLISH (+2.4%)</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading Baltic Exchange indices, freight history, and MySQL cargo dataset..." />
      ) : (
        <>
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 rounded-xl">
              {error}
            </div>
          )}

          {/* Baltic Indices Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {overview?.indices && Object.entries(overview.indices).map(([key, idx]) => (
              <div key={key} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase truncate">{idx.name}</div>
                <div className="text-xl font-extrabold text-white font-mono">{idx.value}</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={idx.change?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                    {idx.change}
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase">{idx.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Historical Time-Series Interactive Chart */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Historical Freight & Index Dynamics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overlaying spot rates, moving averages, BDI movements, and fuel dynamics
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={vesselClass}
                  onChange={(e) => setVesselClass(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="CAPESIZE">Capesize</option>
                  <option value="PANAMAX">Panamax</option>
                  <option value="SUPRAMAX">Supramax</option>
                  <option value="HANDYSIZE">Handysize</option>
                </select>

                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                >
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days</option>
                  <option value={365}>1 Year</option>
                  <option value={730}>2 Years (730d)</option>
                </select>
              </div>
            </div>

            <MarketTrendChart data={history} height={340} />
          </div>

          {/* Bunker Prices Across Key Hubs & Benchmark Spot Rates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bunker Prices */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
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
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
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
                      <span className="text-cyan-400 font-bold">${s.rateUSDPerMT?.toFixed(2)}/MT</span>
                      <span className="text-emerald-400">{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MySQL Historical Cargo Dataset Section */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  MySQL Cargo Dataset Analysis
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Historical commodity movement dataset from database</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by year or item..."
                  value={cargoSearchTerm}
                  onChange={(e) => setCargoSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-full md:w-64"
                />
              </div>
            </div>

            {/* Cargo Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Dataset Rows</p>
                <p className="text-xl font-bold text-white mt-1">{cargoData.length}</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Cargo Volume</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{totalCargoVolume.toLocaleString()} MT</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Dry Bulk Total</p>
                <p className="text-xl font-bold text-cyan-400 mt-1">{totalBulkCarrier.toLocaleString()} MT</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Oil Tanker Volume</p>
                <p className="text-xl font-bold text-indigo-400 mt-1">{totalTanker.toLocaleString()} MT</p>
              </div>
            </div>

            {/* Cargo Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Item Category</th>
                    <th className="p-3">Dry Bulk Carrier</th>
                    <th className="p-3">Oil Tanker</th>
                    <th className="p-3">Off-shore Supply</th>
                    <th className="p-3">Total Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCargoData.map((row) => (
                    <tr key={row.id || `${row.year}-${row.item}`} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-cyan-400">{row.year}</td>
                      <td className="p-3 font-sans text-slate-200">{row.item}</td>
                      <td className="p-3 text-slate-300">{row.dry_cargo_bulk_carrier?.toLocaleString() || '-'}</td>
                      <td className="p-3 text-slate-300">{row.oil_tanker?.toLocaleString() || '-'}</td>
                      <td className="p-3 text-slate-300">{row.off_shore_supply?.toLocaleString() || '-'}</td>
                      <td className="p-3 font-bold text-white">{row.total?.toLocaleString() || '-'}</td>
                    </tr>
                  ))}
                  {filteredCargoData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-500 font-sans">
                        No cargo records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MarketIntelPage;