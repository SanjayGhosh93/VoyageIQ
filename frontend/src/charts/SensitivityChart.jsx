// frontend/src/charts/SensitivityChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

// Safe currency fallback formatter in case formatters.js is missing or errors
const defaultFormatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val || 0);
};

let formatCurrency = defaultFormatCurrency;
try {
  const formatters = require('../utils/formatters');
  if (formatters && formatters.formatCurrency) {
    formatCurrency = formatters.formatCurrency;
  }
} catch (e) {
  // Utility not found, falling back to defaultFormatCurrency
}

export const SensitivityChart = ({ 
  baseCost = 1911400, 
  fuelDelta = 0, 
  freightDelta = 0, 
  waitingDays = 0, 
  height = 240 
}) => {
  const validBaseCost = Number(baseCost) || 0;

  // Estimate fuel portion as ~40% of total landed voyage cost
  const fuelShare = validBaseCost * 0.40;
  
  // Dynamic calculation for active user adjustments
  const activeAdjustedCost = validBaseCost 
    + (fuelShare * (Number(fuelDelta) / 100))
    + (validBaseCost * (Number(freightDelta) / 100))
    + (Number(waitingDays) * 20000);

  const hasActiveDeltas = fuelDelta !== 0 || freightDelta !== 0 || waitingDays > 0;

  // Build comparative what-if scenarios
  const scenarios = [
    {
      name: 'Base Case',
      cost: validBaseCost,
      type: 'base'
    },
    ...(hasActiveDeltas ? [{
      name: 'Current Selection',
      cost: activeAdjustedCost,
      type: activeAdjustedCost > validBaseCost ? 'adverse' : 'favorable'
    }] : []),
    {
      name: 'Fuel -15%',
      cost: validBaseCost - (fuelShare * 0.15),
      type: 'favorable'
    },
    {
      name: 'Fuel +15%',
      cost: validBaseCost + (fuelShare * 0.15),
      type: 'adverse'
    },
    {
      name: 'Freight +10%',
      cost: validBaseCost * 1.10,
      type: 'adverse'
    },
    {
      name: 'Waiting +5 Days',
      cost: validBaseCost + (5 * 20000),
      type: 'adverse'
    }
  ];

  if (validBaseCost === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center border border-slate-800 rounded-xl bg-slate-900/50 text-slate-500 text-sm font-mono"
        style={{ height }}
      >
        No base cost calculated for sensitivity analysis.
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={scenarios} margin={{ top: 15, right: 15, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            interval={0}
          />
          
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickFormatter={(v) => `$${(v / 1000000).toFixed(2)}M`}
            domain={['dataMin * 0.9', 'dataMax * 1.05']}
          />
          
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Landed Voyage Cost']}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              borderColor: '#38bdf8', 
              borderRadius: '0.5rem', 
              color: '#fff', 
              fontSize: '12px' 
            }}
          />
          
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {scenarios.map((entry, index) => {
              let fill = '#38bdf8'; // Base blue
              if (entry.type === 'favorable') fill = '#10b981'; // Emerald green
              if (entry.type === 'adverse') fill = '#f43f5e'; // Rose red
              return <Cell key={`bar-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensitivityChart;