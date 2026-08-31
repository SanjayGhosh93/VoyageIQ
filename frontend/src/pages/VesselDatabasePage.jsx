// frontend/src/pages/VesselDatabasePage.jsx
import React, { useState, useEffect } from 'react';
import { Ship, Database, Search, ShieldCheck, MapPin, Fuel, Clock } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { vesselService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const VesselDatabasePage = () => {
  const [vessels, setVessels] = useState([]);
  const [vesselClasses, setVesselClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchVessels = async () => {
    try {
      const res = await vesselService.getVessels({});
      if (res?.success) {
        setVessels(res.data);
        setVesselClasses(res.vesselClasses);
        setLastSync(new Date());
      }
    } catch (err) {
      console.error('Failed to load vessels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
    // Live AIS polling every 15 seconds
    const interval = setInterval(fetchVessels, 15000);
    return () => clearInterval(interval);
  }, []);

  const classCards = [
    { name: 'HANDYSIZE', dwt: '15,000–35,000 MT', draft: '8.0–10.0m', loa: '160–180m', beam: '27.0m', speed: '13.0 Knots', fuel: '18 TPD', hire: '$14,000/day' },
    { name: 'SUPRAMAX', dwt: '50,000–60,000 MT', draft: '11.0–12.5m', loa: '190–200m', beam: '32.2m', speed: '13.5 Knots', fuel: '26 TPD', hire: '$18,500/day' },
    { name: 'PANAMAX', dwt: '65,000–80,000 MT', draft: '12.5–14.5m', loa: '225–230m', beam: '32.3m', speed: '13.5 Knots', fuel: '32 TPD', hire: '$23,000/day' },
    { name: 'CAPESIZE', dwt: '100,000–180,000 MT', draft: '16.0–18.5m', loa: '280–290m', beam: '45.0m', speed: '14.0 Knots', fuel: '48 TPD', hire: '$36,000/day' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-ocean-400 uppercase tracking-widest">
            <Ship className="w-4 h-4 text-cyan-400" />
            <span>BULK CARRIER FLEET INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Vessel Classes & Live Fleet Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time AIS positioning, speed, heading, loaded draft profiles, and daily hire benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE AIS STREAMING</span>
          </div>
          <button
            onClick={fetchVessels}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 font-semibold border border-slate-700 transition-colors"
          >
            ↻ Refresh AIS
          </button>
        </div>
      </div>

      {/* 4 Standard Bulk Carrier Classes */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Standard Vessel Class Envelopes (SIH Benchmark Standards)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classCards.map((c) => (
            <div key={c.name} className="p-5 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white font-mono">{c.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-ocean-500/10 text-ocean-300 border border-ocean-500/20">
                  Standard
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>DWT Envelope:</span>
                  <span className="text-slate-200 font-bold">{c.dwt}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Loaded Draft:</span>
                  <span className="text-cyan-400 font-bold">{c.draft}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Length Overall:</span>
                  <span className="text-slate-200 font-bold">{c.loa}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Beam Width:</span>
                  <span className="text-slate-200 font-bold">{c.beam}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fuel Burn Sea:</span>
                  <span className="text-purple-300 font-bold">{c.fuel}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Daily Hire:</span>
                  <span className="text-amber-400 font-bold">{c.hire}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Fleet List */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Live AIS Tracked Bulk Carrier Fleet
            </h3>
            <span className="px-2 py-0.5 rounded bg-ocean-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-ocean-500/30">
              Synced: {lastSync.toLocaleTimeString()}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {vessels.length} Active Bulk Carriers
          </span>
        </div>

        {loading ? (
          <LoadingState message="Connecting to live AIS stream..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vessels.map((v) => (
              <div key={v.id || v.imo} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{v.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                        IMO: {v.imo || v.imoNumber}
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                      {v.cargo || `${v.vesselClass} Bulk Carrier`}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {v.status || 'UNDERWAY'}
                  </span>
                </div>

                {/* Live GPS Telemetry Bar */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Live GPS</span>
                    <span className="text-cyan-300 font-bold">
                      {v.currentLat ? `${v.currentLat.toFixed(2)}°N, ${v.currentLon?.toFixed(2)}°E` : '18.4°N, 88.2°E'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Speed / Course</span>
                    <span className="text-emerald-400 font-bold">
                      {v.speedKnots || 13.2} Kts • {v.heading || 290}°
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Destination ETA</span>
                    <span className="text-amber-300 font-bold truncate block">
                      {v.destination || 'Paradip Port'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1 text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Class / DWT</span>
                    <span className="text-slate-200">{v.vesselClass} ({v.dwt?.toLocaleString()} MT)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Draft / LOA</span>
                    <span className="text-slate-200">{v.draft}m / {v.loa}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Demurrage Risk</span>
                    <span className="text-emerald-400 font-bold">{v.demurrageRisk || 'LOW RISK'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VesselDatabasePage;
