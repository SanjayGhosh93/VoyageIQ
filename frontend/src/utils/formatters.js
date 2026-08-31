// frontend/src/utils/formatters.js

export const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatCurrencyPerMT = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00/MT';
  return `$${Number(val).toFixed(2)}/MT`;
};

export const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${Number(val).toFixed(1)}%`;
};
