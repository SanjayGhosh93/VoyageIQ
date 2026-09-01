// frontend/src/pages/PortDatabasePage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  Layers,
  Database
} from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { portService } from '../services/api';

export const PortDatabasePage = () => {
  const [ports, setPorts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPorts = async () => {
      setLoading(true);
      try {
        const res = await portService.getPorts({});
        if (res?.success) {
          setPorts(res.data);
        }
      } catch (err) {
        console.error('Failed to load ports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPorts();
  }, []);

  const filteredPorts = ports.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'ALL' || (regionFilter === 'East Coast India' ? p.region === 'East Coast India' : p.region !== 'East Coast India');
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span>SAIL MARITIME INFRASTRUCTURE REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Port Intelligence & Navigational Constraints
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Draught limits, LOA, beam, mechanized handling TPH, and lightering availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRegionFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              regionFilter === 'ALL' ? 'bg-sky-600 text-white font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800'
            }`}
          >
            All Ports ({ports.length})
          </button>
          <button
            onClick={() => setRegionFilter('East Coast India')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              regionFilter === 'East Coast India' ? 'bg-sky-600 text-white font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800'
            }`}
          >
            East Coast India (9)
          </button>
          <button
            onClick={() => setRegionFilter('Overseas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              regionFilter === 'Overseas' ? 'bg-sky-600 text-white font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800'
            }`}
          >
            Overseas Origins (8)
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search port name, country, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-500 hidden sm:block">
          Showing {filteredPorts.length} ports
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading port bathymetry and berthing constraints..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPorts.map((p) => (
            <div key={p.name} className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{p.name}</h3>
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                      <span>{p.country} ({p.code || 'PORT'})</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-300">
                    {p.dataQuality || 'SIMULATED'}
                  </span>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Berth Draft</span>
                    <span className="text-slate-800 dark:text-white font-bold">{p.berthDraft}m</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Max LOA / Beam</span>
                    <span className="text-slate-800 dark:text-white font-bold">{p.maxLOA}m / {p.maxBeam}m</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Discharge TPH</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{p.handlingRateTPH} TPH</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Avg Waiting</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{p.averageWaitingDays || 2.0} Days</span>
                  </div>
                </div>

                {/* Badges & Features */}
                <div className="flex flex-wrap gap-1.5 mt-3 text-[10px] font-mono">
                  {p.tideDependent && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Tidal Gated
                    </span>
                  )}
                  {p.lighteringAvailable && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      Lightering Ready
                    </span>
                  )}
                  {p.transshipmentAvailable && (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                      Transshipment
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Src: {p.source || 'Port Tariffs 2026'}</span>
                <span>Conf: {Math.round((p.confidence || 0.92) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortDatabasePage;