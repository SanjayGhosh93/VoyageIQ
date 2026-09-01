// frontend/src/charts/FreightForecastChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isForecast = data.isForecast || false;
    const spotVal = data.historicalRate ?? data.ratePerMT;

    return (
      <div className="bg-slate-900/95 border border-cyan-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="text-slate-400 font-bold mb-2 pb-1 border-b border-slate-700 flex justify-between gap-4">
          <span>{label}</span>
          <span className={isForecast ? 'text-amber-400' : 'text-cyan-400'}>
            {isForecast ? 'PROJECTION' : 'HISTORICAL'}
          </span>
        </div>
        {spotVal !== undefined && spotVal !== null && (
          <div className="text-cyan-400 flex justify-between gap-4 py-0.5">
            <span>Spot Rate:</span>
            <span className="font-semibold">${Number(spotVal).toFixed(2)}/MT</span>
          </div>
        )}
        {data.predictedRate !== undefined && (
          <div className="text-amber-400 flex justify-between gap-4 py-0.5">
            <span>Forecast Rate:</span>
            <span className="font-semibold">${Number(data.predictedRate).toFixed(2)}/MT</span>
          </div>
        )}
        {data.upperBand && data.lowerBand && isForecast && (
          <div className="text-slate-400 flex justify-between gap-4 py-0.5 text-[11px]">
            <span>95% Confidence:</span>
            <span>${Number(data.lowerBand).toFixed(2)} – ${Number(data.upperBand).toFixed(2)}</span>
          </div>
        )}
        {data.ema20 && (
          <div className="text-emerald-400 flex justify-between gap-4 py-0.5">
            <span>EMA 20:</span>
            <span>${Number(data.ema20).toFixed(2)}</span>
          </div>
        )}
        {data.ema50 && (
          <div className="text-purple-400 flex justify-between gap-4 py-0.5">
            <span>EMA 50:</span>
            <span>${Number(data.ema50).toFixed(2)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const FreightForecastChart = ({ data = [], currentRate = 18.42, height = 360 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No forecast time-series data available
      </div>
    );
  }

  // Normalize backend API payload to chart expected structure
  const formattedData = data.map((item) => ({
    ...item,
    historicalRate: item.historicalRate ?? (!item.isForecast ? item.ratePerMT : undefined),
    predictedRate: item.predictedRate ?? (item.isForecast ? item.ratePerMT : undefined)
  }));

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formattedData} margin={{ top: 15, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="forecastBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickLine={false}
          />
          
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickFormatter={(val) => `$${val}`}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            iconType="plainline"
          />

          {/* Shaded Confidence Envelope Area */}
          <Area
            type="monotone"
            dataKey="upperBand"
            stroke="transparent"
            fill="url(#forecastBandGrad)"
            name="Confidence Envelope (95%)"
          />
          <Area
            type="monotone"
            dataKey="lowerBand"
            stroke="transparent"
            fill="#030712"
            name="Band Floor"
            legendType="none"
          />

          {/* Historical spot line */}
          <Line
            type="monotone"
            dataKey="historicalRate"
            stroke="#38bdf8"
            strokeWidth={2.5}
            dot={false}
            name="Historical Spot ($/MT)"
          />

          {/* Predicted forecast line */}
          <Line
            type="monotone"
            dataKey="predictedRate"
            stroke="#fbbf24"
            strokeWidth={3}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#fbbf24' }}
            name="AI Forecast ($/MT)"
          />

          {/* Moving Averages */}
          <Line
            type="monotone"
            dataKey="ema20"
            stroke="#34d399"
            strokeWidth={1.5}
            dot={false}
            name="EMA 20"
          />
          <Line
            type="monotone"
            dataKey="ema50"
            stroke="#c084fc"
            strokeWidth={1.5}
            dot={false}
            name="EMA 50"
          />

          {/* Current Rate Reference Line */}
          {currentRate && (
            <ReferenceLine 
              y={currentRate} 
              stroke="#64748b" 
              strokeDasharray="2 2"
              label={{ value: `Current: $${currentRate}`, fill: '#94a3b8', fontSize: 11, position: 'right' }} 
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="absolute top-2 right-4 text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
        LIVE MARKET FEED
      </div>
    </div>
  );
};

export default FreightForecastChart;