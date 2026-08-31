// frontend/src/charts/CostBreakdownChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#f87171', '#fb923c'];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
        <div className="font-bold text-slate-200">{data.name}</div>
        <div className="text-cyan-400 font-semibold">{formatCurrency(data.amount)}</div>
        <div className="text-slate-400 text-[11px]">{data.percentage}% of total landed cost</div>
      </div>
    );
  }
  return null;
};

export const CostBreakdownChart = ({ breakdown = [], height = 260 }) => {
  if (!breakdown || breakdown.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-500 text-xs">No cost data</div>;
  }

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={breakdown}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
          >
            {breakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostBreakdownChart;
