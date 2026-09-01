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

// Safe currency fallback formatter
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

const DEFAULT_COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#f87171', '#fb923c'];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
        <div className="font-bold text-slate-200">{data.name}</div>
        <div className="text-sky-400 font-semibold">{formatCurrency(data.amount)}</div>
        <div className="text-slate-400 text-[11px] mt-0.5">
          {data.percentage}% of total landed cost
        </div>
      </div>
    );
  }
  return null;
};

export const CostBreakdownChart = ({ breakdown = [], height = 260 }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center border border-slate-800 rounded-xl bg-slate-900/50 text-slate-500 text-xs font-mono"
        style={{ height }}
      >
        No cost breakdown data available
      </div>
    );
  }

  // Calculate overall total amount to compute percentages on the fly
  const totalAmount = breakdown.reduce((sum, item) => {
    const val = Number(item.amount ?? item.value ?? item.cost ?? 0);
    return sum + val;
  }, 0);

  // Normalize data keys and assign accurate percentage shares
  const normalizedData = breakdown.map((item, idx) => {
    const amount = Number(item.amount ?? item.value ?? item.cost ?? 0);
    const percentage = item.percentage ?? (totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0.0');
    
    return {
      name: item.name || item.label || item.category || `Expense #${idx + 1}`,
      amount,
      percentage,
      color: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
    };
  });

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={normalizedData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
          >
            {normalizedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
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