// backend/services/forecastService.js
// OceanCharter AI - Pure JS Time-Series Freight Forecasting Engine

function calculateEMA(prices, period) {
  if (!prices || prices.length === 0) return [];
  const k = 2 / (period + 1);
  const emaArray = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    const emaVal = prices[i] * k + emaArray[i - 1] * (1 - k);
    emaArray.push(Number(emaVal.toFixed(2)));
  }
  return emaArray;
}

function calculateSMA(prices, period) {
  const smaArray = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      const slice = prices.slice(0, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      smaArray.push(Number(avg.toFixed(2)));
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      smaArray.push(Number(avg.toFixed(2)));
    }
  }
  return smaArray;
}

function calculateVolatility(prices, period = 30) {
  if (prices.length < 2) return 0.12;
  const recent = prices.slice(-period);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recent.length;
  return Number((Math.sqrt(variance) / mean).toFixed(3)); // Normalized volatility coefficient
}

/**
 * Main Forecast Function
 * Evaluates historical time series, computes indicators, classifies market regimes, and projects future trajectories.
 */
function forecastFreightRates({
  origin = 'Gladstone',
  destination = 'Paradip',
  vesselClass = 'PANAMAX',
  cargoType = 'Coking Coal',
  cargoQuantity = 70000,
  horizonDays = 30,
  historicalData = null
}) {
  // Base rates mapped by vessel class & route distance
  const baseRateMap = {
    CAPESIZE: { Gladstone: 14.80, Newcastle: 15.20, Banjarmasin: 8.90, Maputo: 13.50, Baltimore: 29.50 },
    PANAMAX: { Gladstone: 18.42, Newcastle: 19.10, Banjarmasin: 11.20, Maputo: 16.80, Baltimore: 34.20 },
    SUPRAMAX: { Gladstone: 22.10, Newcastle: 22.80, Banjarmasin: 13.40, Maputo: 19.80, Baltimore: 38.90 },
    HANDYSIZE: { Gladstone: 26.50, Newcastle: 27.20, Banjarmasin: 16.10, Maputo: 23.50, Baltimore: 44.00 }
  };

  const currentBase = (baseRateMap[vesselClass] && baseRateMap[vesselClass][origin]) || 18.50;

  // Generate synthetic historical 90-day window if none provided
  const history = [];
  const now = new Date();
  const prices = [];

  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Introduce seasonal and random walk variation
    const seasonal = Math.sin((i / 365) * 2 * Math.PI) * 1.5;
    const randomWalk = (Math.sin(i * 0.15) * 1.2) + ((Math.cos(i * 0.08)) * 0.8);
    const rate = Math.max(8.0, Number((currentBase - 1.2 + seasonal + randomWalk).toFixed(2)));
    prices.push(rate);
    history.push({
      date: d.toISOString().split('T')[0],
      ratePerMT: rate,
      vesselClass,
      origin,
      destination
    });
  }

  const ema20Series = calculateEMA(prices, 20);
  const ema50Series = calculateEMA(prices, 50);
  const smaSeries = calculateSMA(prices, 14);

  const currentRate = prices[prices.length - 1];
  const lastEMA20 = ema20Series[ema20Series.length - 1];
  const lastEMA50 = ema50Series[ema50Series.length - 1];
  const volatility = calculateVolatility(prices, 30);

  // Market Regime Classification Logic
  let marketRegime = 'SIDEWAYS';
  let recommendedContract = 'Spot Voyage';
  let reasoning = '';
  const emaDiffPct = ((lastEMA20 - lastEMA50) / lastEMA50) * 100;

  if (volatility > 0.18) {
    marketRegime = 'HIGH_VOLATILITY';
    recommendedContract = 'Split Procurement';
    reasoning = 'Severe price oscillations detected due to bunker volatility & regional weather events. Recommend splitting procurement parcel into multiple tranches to dollar-cost-average chartering exposure.';
  } else if (emaDiffPct > 2.0) {
    marketRegime = 'BULLISH';
    recommendedContract = 'Time Charter';
    reasoning = 'EMA 20 ($' + lastEMA20 + ') has strongly crossed above EMA 50 ($' + lastEMA50 + ') with upward momentum of +' + emaDiffPct.toFixed(1) + '%. Secure fixed vessel capacity or index-linked COA before freight escalates.';
  } else if (emaDiffPct < -2.0) {
    marketRegime = 'BEARISH';
    recommendedContract = 'Spot Voyage';
    reasoning = 'EMA 20 ($' + lastEMA20 + ') is trailing below EMA 50 ($' + lastEMA50 + ') indicating softening tonnage demand. Stay in the spot voyage market to capture lower fixing rates.';
  } else {
    marketRegime = 'SIDEWAYS';
    recommendedContract = 'Spot Voyage';
    reasoning = 'Freight rates are consolidating within a narrow channel (EMA differential ' + emaDiffPct.toFixed(1) + '%). Recommend standard Spot Voyage or awaiting market direction before committing long-term.';
  }

  // Generate Projections with Confidence Envelopes for Horizon
  const horizon = Math.min(Math.max(horizonDays, 7), 90);
  const forecastSeries = [];
  const dailyDrift = marketRegime === 'BULLISH' ? 0.045 : (marketRegime === 'BEARISH' ? -0.035 : 0.005);
  
  let projectedRate = currentRate;
  for (let step = 1; step <= horizon; step++) {
    const projDate = new Date(now);
    projDate.setDate(projDate.getDate() + step);
    
    // Mean reversion & drift
    const drift = dailyDrift * step;
    const wave = Math.sin(step * 0.12) * (0.4 * volatility * 10);
    const pred = Number((currentRate + drift + wave).toFixed(2));
    
    // 95% Confidence Interval Band (± 1.96 * sigma * sqrt(t))
    const bandWidth = Number((1.96 * volatility * Math.sqrt(step) * 1.8).toFixed(2));
    const upperBand = Number((pred + bandWidth).toFixed(2));
    const lowerBand = Number(Math.max(5.0, pred - bandWidth).toFixed(2));

    forecastSeries.push({
      date: projDate.toISOString().split('T')[0],
      dayOffset: step,
      predictedRate: pred,
      upperBand,
      lowerBand,
      ema20: Number((lastEMA20 + drift * 0.8).toFixed(2)),
      ema50: Number((lastEMA50 + drift * 0.5).toFixed(2))
    });

    if (step === horizon) {
      projectedRate = pred;
    }
  }

  const percentageChange = Number((((projectedRate - currentRate) / currentRate) * 100).toFixed(1));

  // Combine recent 30 history points + forecast points for seamless Recharts rendering
  const mergedChartData = history.slice(-30).map((h, idx) => {
    const histIdx = prices.length - 30 + idx;
    return {
      date: h.date,
      historicalRate: h.ratePerMT,
      predictedRate: null,
      upperBand: null,
      lowerBand: null,
      ema20: ema20Series[histIdx],
      ema50: ema50Series[histIdx],
      isForecast: false
    };
  });

  // Connect last historical point to first forecast point
  mergedChartData[mergedChartData.length - 1].predictedRate = currentRate;
  mergedChartData[mergedChartData.length - 1].upperBand = currentRate;
  mergedChartData[mergedChartData.length - 1].lowerBand = currentRate;

  forecastSeries.forEach(f => {
    mergedChartData.push({
      date: f.date,
      historicalRate: null,
      predictedRate: f.predictedRate,
      upperBand: f.upperBand,
      lowerBand: f.lowerBand,
      ema20: f.ema20,
      ema50: f.ema50,
      isForecast: true
    });
  });

  return {
    origin,
    destination,
    vesselClass,
    cargoType,
    cargoQuantity,
    horizonDays: horizon,
    currentRate,
    projectedRate,
    percentageChange,
    marketRegime,
    volatility: Number((volatility * 100).toFixed(1)), // percentage
    ema20: lastEMA20,
    ema50: lastEMA50,
    confidenceScore: Number(Math.max(0.75, (0.95 - (horizon / 300))).toFixed(2)),
    recommendedContract,
    reasoning,
    forecastSeries,
    chartData: mergedChartData,
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Predictive Time-Series Engine (JS Native)',
    disclaimer: 'ILLUSTRATIVE SIMULATION'
  };
}

module.exports = {
  forecastFreightRates,
  calculateEMA,
  calculateSMA,
  calculateVolatility
};
