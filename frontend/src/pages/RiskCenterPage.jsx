// frontend/src/pages/RiskCenterPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Anchor, 
  CloudRain, 
  Clock, 
  Ship,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { RiskGauge } from '../charts/RiskGauge';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { riskService } from '../services/api';
import { DESTINATION_PORTS, VESSEL_CLASSES } from '../utils/constants';

export const RiskCenterPage = () => {
  const [destination, setDestination] = useState('Paradip');
  const [vesselClass, setVesselClass] = useState('PANAMAX');
  const [weatherScore, setWeatherScore] = useState(20);
  const [overrideQueue, setOverrideQueue] = useState(4);

  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRisk = async () => {
    setLoading(true);
    try {
      const res = await riskService.calculateRisk({
        destination,
        vesselClass,
        weatherScore,
        overrideQueue
      });
      if (res?.success) {
        setRiskData(res.data);
      }
    } catch (err) {
      console.error('Risk query failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, [destination, vesselClass, weatherScore, overrideQueue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>SAIL DEMURRAGE RISK RADAR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Demurrage Risk Center (0–100 Index)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Weighted multi-factor analysis: Monsoon (15%), Queue (20%), Weather (20%), Berths (15%), Draught (20%), TPH (10%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="risk" value={riskData?.riskLevel || 'LOW'} size="lg" />
        </div>
      </div>

      {/* Control Selector Bar */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-ocean-400" />
          <span>Port & Maritime Risk Conditions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Discharge Port</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
            >
              {DESTINATION_PORTS.map((p) => (
                <option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Vessel Class</label>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v.value} value={v.value} className="bg-slate-900">{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Port Waiting Queue:</span>
              <span className="font-mono text-amber-400 font-bold">{overrideQueue} Vessels</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={overrideQueue}
              onChange={(e) => setOverrideQueue(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Weather / Swell Intensity:</span>
              <span className="font-mono text-cyan-400 font-bold">{weatherScore}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weatherScore}
              onChange={(e) => setWeatherScore(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Evaluating tidal charts, anchorage lineups, and seasonal monsoon patterns..." />
      ) : (
        riskData && (
          <>
            {/* Risk Gauge & Advice Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Animated Circular Gauge */}
              <div className="lg:col-span-5 p-6 rounded-3xl glass-panel flex flex-col items-center justify-center space-y-4">
                <div className="text-xs font-mono uppercase font-bold text-slate-400">
                  Calculated Demurrage Risk Index
                </div>
                <RiskGauge
                  score={riskData.riskScore}
                  level={riskData.riskLevel}
                  topContributors={riskData.topContributors}
                />
              </div>

              {/* Right 7 Cols: Operational Mitigation Advice & Factor Breakdown */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-navy-950 border border-ocean-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Demurrage Mitigation Directive
                  </h3>
                  <span className="text-xs font-mono text-ocean-400 font-bold">
                    Target: {destination}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-1 text-sm font-mono">
                    Operational Advisory:
                  </strong>
                  {riskData.mitigationAdvice}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Factor Contribution Breakdown
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {riskData.topContributors?.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-200">{c.factor}</span>
                          <span className="text-amber-400 font-mono">+{c.contribution} pts</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{c.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* East Coast India Comparative Port Risks Matrix */}
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Comparative Demurrage Risk Across Indian East Coast Ports
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Vessel: <strong className="text-white">{vesselClass}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {riskData.comparativePortRisks?.map((pr, idx) => (
                  <div
                    key={idx}
                    onClick={() => setDestination(pr.portName)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      destination === pr.portName
                        ? 'bg-slate-900 border-amber-400/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-sm">{pr.portName}</span>
                      <StatusBadge type="risk" value={pr.riskLevel} />
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Draft</span>
                        <span className="text-slate-200">{pr.berthDraft}m</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Queue</span>
                        <span className="text-slate-200">{pr.queueLength} Ships</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Risk Score</span>
                        <span className="text-amber-400 font-bold">{pr.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default RiskCenterPage;
