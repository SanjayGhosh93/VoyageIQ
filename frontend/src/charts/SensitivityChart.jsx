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
import { formatCurrency } from '../utils/formatters';

export const SensitivityChart = ({ baseCost = 1911400, fuelDelta = 0, freightDelta = 0, waitingDays = 2.5, height = 240 }) => {
  // Compute comparative what-if scenarios
  const scenarios = [
    {
      name: 'Base Case',
      cost: baseCost,
      type: 'base'
    },
    {
      name: 'Fuel -15%',
      cost: baseCost * 0.94,
      type: 'favorable'
    },
    {
      name: 'Fuel +15%',
      cost: baseCost * 1.06,
      type: 'adverse'
    },
    {
      name: 'Freight +10%',
      cost: baseCost * 1.08,
      type: 'adverse'
    },
    {
      name: 'Waiting +5 Days',
      cost: baseCost + (5 * 20000),
      type: 'adverse'
    }
  ];

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={scenarios} margin={{ top: 15, right: 15, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Total Landed Cost']}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#38bdf8', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {scenarios.map((entry, index) => {
              let fill = '#38bdf8';
              if (entry.type === 'favorable') fill = '#10b981';
              if (entry.type === 'adverse') fill = '#f43f5e';
              return <Cell key={`bar-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensitivityChart;
