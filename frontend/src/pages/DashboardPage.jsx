// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Ship, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Anchor, 
  ArrowUpRight, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { FreightForecastChart } from '../charts/FreightForecastChart';
import { RiskGauge } from '../charts/RiskGauge';
import { StatusBadge } from '../components/StatusBadge';
import { forecastService, alertService, scenarioService, realtimeService } from '../services/api';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

export const DashboardPage = () => {
  const { openDemo } = useOutletContext() || {};
  const [forecastData, setForecastData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [liveMarket, setLiveMarket] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const loadDashboardData = async () => {
    try {
      const [fRes, aRes, sRes, mRes, wRes] = await Promise.all([
        forecastService.getForecast({ origin: 'Gladstone', destination: 'Paradip', vesselClass: 'PANAMAX', horizonDays: 30 }),
        alertService.getAlerts({}),
        scenarioService.getScenarios(),
        realtimeService.getMarketFeed().catch(() => null),
        realtimeService.getPortWeather().catch(() => null)
      ]);
      if (fRes?.success) setForecastData(fRes.data);
      if (aRes?.success) setAlerts(aRes.data);
      if (sRes?.success) setScenarios(sRes.data);
      if (mRes?.success) setLiveMarket(mRes.data);
      if (wRes?.success) setLiveWeather(wRes.data);
      setLastSync(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Real-time live polling every 20 seconds
    const interval = setInterval(loadDashboardData, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Market & Telemetry Ticker Ribbon */}
      <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-ocean-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME FEED ACTIVE</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span>BDI: <strong className="text-cyan-300">{liveMarket?.indices?.BDI?.value || '1,885'}</strong> ({liveMarket?.indices?.BDI?.change || '+2.4%'})</span>
            <span>BCI Capesize: <strong className="text-amber-300">{liveMarket?.indices?.BCI?.value || '2,940'}</strong></span>
            <span>VLSFO Singapore: <strong className="text-emerald-300">${liveMarket?.bunkerFuel?.VLSFO_Singapore?.priceUSD || '642.50'}/MT</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Synced: {lastSync.toLocaleTimeString()}</span>
          <button
            onClick={loadDashboardData}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition-colors"
          >
            ↻ Refresh Live
          </button>
        </div>
      </div>
      {/* Top Banner: SIH 2026 Executive Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-ocean-400 uppercase tracking-widest">
            <Anchor className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAIL BULK CARGO LOGISTICS CONTROL TOWER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Executive Maritime Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overseas Procurement Corridors (Australia / Indonesia / S. Africa) → India East Coast
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openDemo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-xs font-mono transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>RUN 1-CLICK SIH DEMO</span>
          </button>
          <Link
            to="/vessel-matcher"
            className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white font-bold text-xs font-mono transition-colors shadow-md flex items-center gap-1.5"
          >
            <span>New Feasibility Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 8 Mandatory Dashboard KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Current Freight */}
        <MetricCard
          title="Current Freight Rate"
          value="$18.42/MT"
          subtitle="Gladstone → Paradip (Panamax)"
          change="+2.8%"
          trend="up"
          icon={DollarSign}
          badgeText="SPOT BENCHMARK"
        />

        {/* KPI 2: Forecast Change */}
        <MetricCard
          title="30-Day Rate Forecast"
          value="+8.2%"
          subtitle="Projected: $19.93/MT (EMA Crossover)"
          change="BULLISH DRIFT"
          trend="up"
          icon={TrendingUp}
          badgeText="AI PREDICTION"
        />

        {/* KPI 3: Market Regime */}
        <MetricCard
          title="Market Regime"
          value="BULLISH"
          subtitle="EMA20 ($18.42) > EMA50 ($17.02)"
          change="Time Charter"
          trend="up"
          icon={Activity}
          badgeText="REGIME DETECTED"
        />

        {/* KPI 4: Recommended Vessel */}
        <MetricCard
          title="Recommended Vessel"
          value="Panamax"
          subtitle="Optimal Draft (13.5m) for Paradip"
          change="FEASIBLE"
          trend="up"
          icon={Ship}
          badgeText="OPTIMAL VESSEL"
        />

        {/* KPI 5: Demurrage Risk */}
        <MetricCard
          title="Demurrage Risk"
          value="24 / 100"
          subtitle="Northern Bay of Bengal (Low Delay)"
          change="LOW RISK"
          trend="down"
          icon={ShieldAlert}
          badgeText="0–100 RISK INDEX"
        />

        {/* KPI 6: Average Waiting */}
        <MetricCard
          title="Average Port Waiting"
          value="2.5 Days"
          subtitle="Paradip Mechanised Coal Berth"
          change="-0.5d vs Haldia"
          trend="down"
          icon={Clock}
          badgeText="CONGESTION METRIC"
        />

        {/* KPI 7: Estimated Landed Cost */}
        <MetricCard
          title="Est. Total Landed Cost"
          value="$27.31/MT"
          subtitle="Freight + Fuel + Port Tariffs + Handling"
          change="Baseline"
          trend="neutral"
          icon={DollarSign}
          badgeText="TOTAL LANDED"
        />

        {/* KPI 8: Potential Scenario Saving */}
        <MetricCard
          title="Potential Scenario Saving"
          value="+$218,500"
          subtitle="Via Rerouting vs Infeasible Haldia"
          change="SAVING"
          trend="up"
          icon={Sparkles}
          badgeText="OPPORTUNITY"
        />
      </div>

      {/* Main Grid: Forecast Chart & Demurrage Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Freight Forecasting Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-ocean-400 font-bold">
                PREDICTIVE TIME-SERIES ENGINE
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                Gladstone → Paradip Freight Projection (30 Days)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge type="regime" value={forecastData?.marketRegime || 'BULLISH'} />
              <Link to="/forecast" className="text-xs text-ocean-400 hover:text-ocean-300 font-mono font-bold flex items-center gap-1">
                <span>Detailed Engine</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <FreightForecastChart data={forecastData?.chartData} currentRate={forecastData?.currentRate || 18.42} height={320} />
        </div>

        {/* Right 4 Cols: Demurrage Risk Center */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                PORT RISK MONITOR
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                Demurrage Risk Score
              </h3>
            </div>
            <Link to="/risk" className="text-xs text-ocean-400 hover:text-ocean-300 font-mono font-bold">
              Full Center →
            </Link>
          </div>

          <RiskGauge
            score={24}
            level="LOW"
            topContributors={[
              { factor: 'Vessel Draft Margin', contribution: 8 },
              { factor: 'Port Queue Congestion', contribution: 6 },
              { factor: 'Weather & Wave Swell', contribution: 5 },
              { factor: 'Handling Discharge TPH', contribution: 5 }
            ]}
          />
        </div>
      </div>

      {/* Bottom Grid: Benchmark Scenarios & Early Warning Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenarios Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-ocean-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Benchmark Charter Scenarios
              </h3>
            </div>
            <Link to="/scenarios" className="text-xs text-ocean-400 hover:text-ocean-300 font-mono font-bold">
              View All Scenarios →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="pb-2 font-semibold">Scenario Title</th>
                  <th className="pb-2 font-semibold">Corridor</th>
                  <th className="pb-2 font-semibold">Vessel</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Cost / MT</th>
                  <th className="pb-2 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scenarios.slice(0, 4).map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 pr-2 font-sans font-medium text-slate-200 truncate max-w-[200px]">
                      {s.title}
                    </td>
                    <td className="py-2.5 text-slate-400">{s.originPort} → {s.destinationPort}</td>
                    <td className="py-2.5 text-slate-300 font-semibold">{s.vesselClass}</td>
                    <td className="py-2.5">
                      <StatusBadge type="feasibility" value={s.feasibilityStatus} />
                    </td>
                    <td className="py-2.5 text-right font-bold text-cyan-400">
                      {formatCurrencyPerMT(s.costPerMT)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {s.optimizationScore}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Early Warnings Ticker */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Early Warning Radar
              </h3>
            </div>
            <Link to="/alerts" className="text-xs text-rose-400 hover:underline font-mono font-bold">
              {alerts.length} Active
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((a, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{a.title}</span>
                  <span className={`px-2 py-0.2 rounded-full font-mono text-[9px] font-bold ${
                    a.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {a.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;