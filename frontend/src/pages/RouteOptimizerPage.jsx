// frontend/src/pages/RouteOptimizerPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Sparkles, 
  Compass, 
  Ship, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Sliders, 
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { RouteVisualizer } from '../components/RouteVisualizer';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { routeService } from '../services/api';
import { ORIGIN_PORTS, VESSEL_CLASSES } from '../utils/constants';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

export const RouteOptimizerPage = () => {
  const [origin, setOrigin] = useState('Gladstone');
  const [vesselClass, setVesselClass] = useState('PANAMAX');
  const [cargoQuantity, setCargoQuantity] = useState(70000);
  const [priority, setPriority] = useState('Balanced');

  const [routesData, setRoutesData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOptimizedRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeService.optimizeRoute({
        origin,
        vesselClass,
        cargoQuantity,
        priority
      });
      if (res?.success) {
        setRoutesData(res);
        setSelectedRoute(res.bestRoute || res.routes?.[0]);
      }
    } catch (err) {
      console.error('Route optimization query failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimizedRoutes();
  }, [origin, vesselClass, cargoQuantity, priority]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            <Compass className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>SAIL MULTI-DESTINATION ROUTE SCORING</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Maritime Route Optimizer & Corridor Analytics
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Compare overseas loading origins against 5 East Coast discharge hubs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Lowest Cost', 'Lowest Risk', 'Fastest Delivery', 'Balanced'].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                priority === p
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor Map Visualizer */}
      {selectedRoute && (
        <RouteVisualizer
          origin={selectedRoute.origin}
          destination={selectedRoute.destination}
          distanceNM={selectedRoute.distanceNM}
          sailingDays={selectedRoute.sailingDays}
          vesselClass={vesselClass}
        />
      )}

      {/* Routes Comparison Matrix */}
      {loading ? (
        <LoadingState message="Optimizing shipping distances, nautical routes, and port turnaround times..." />
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Corridor Optimization Matrix (Ranked by {priority})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Optimal: <strong className="text-amber-600 dark:text-amber-400">{routesData?.bestRoute?.destination} Port</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routesData?.routes?.map((r, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedRoute(r)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRoute?.destination === r.destination
                    ? 'bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {idx === 0 ? '#1 OPTIMAL' : `OPTION ${idx + 1}`}
                    </span>
                    <StatusBadge type="feasibility" value={r.feasibilityStatus} />
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{r.routeName}</h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-mono">
                    {r.distanceNM.toLocaleString()} NM • {r.totalVoyageDays} Total Days
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Landed / MT</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{formatCurrencyPerMT(r.costPerMT)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase">Demurrage Risk</span>
                      <span className={`font-bold ${r.riskScore > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {r.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Score: <strong className="text-slate-900 dark:text-white font-bold">{r.optimizationScore}/100</strong></span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizerPage;