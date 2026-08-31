// frontend/src/charts/MarketTrendChart.jsx
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const MarketTrendChart = ({ data = [], height = 320 }) => {
  const [activeMetric, setActiveMetric] = useState('ratePerMT');

  return (
    <div className="w-full">
      {/* Metric Selectors */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setActiveMetric('ratePerMT')}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            activeMetric === 'ratePerMT'
              ? 'bg-ocean-500 text-white shadow-lg shadow-ocean-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Freight Rate ($/MT)
        </button>
        <button
          onClick={() => setActiveMetric('marketIndexBDI')}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            activeMetric === 'marketIndexBDI'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Baltic Dry Index (BDI)
        </button>
        <button
          onClick={() => setActiveMetric('fuelPriceVLSFO')}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            activeMetric === 'fuelPriceVLSFO'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Bunker Fuel ($/MT)
        </button>
      </div>

      <div className="w-full relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              tickLine={false}
              tickFormatter={(v) => activeMetric === 'marketIndexBDI' ? v : `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#0284c7',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />

            {activeMetric === 'ratePerMT' && (
              <>
                <Line type="monotone" dataKey="ratePerMT" stroke="#38bdf8" strokeWidth={2.5} dot={false} name="Spot Freight ($/MT)" />
                <Line type="monotone" dataKey="ema20" stroke="#34d399" strokeWidth={1.5} dot={false} name="EMA 20" />
                <Line type="monotone" dataKey="ema50" stroke="#c084fc" strokeWidth={1.5} dot={false} name="EMA 50" />
              </>
            )}

            {activeMetric === 'marketIndexBDI' && (
              <Line type="monotone" dataKey="marketIndexBDI" stroke="#fbbf24" strokeWidth={2.5} dot={false} name="Baltic Dry Index (Pts)" />
            )}

            {activeMetric === 'fuelPriceVLSFO' && (
              <Line type="monotone" dataKey="fuelPriceVLSFO" stroke="#a855f7" strokeWidth={2.5} dot={false} name="VLSFO Bunker ($/MT)" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketTrendChart;
