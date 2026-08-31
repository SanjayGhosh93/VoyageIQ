const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  vesselClass: { type: String, required: true },
  cargoType: { type: String, default: 'Coking Coal' },
  horizonDays: { type: Number, default: 30 },
  currentRate: { type: Number, required: true },
  projectedRate: { type: Number, required: true },
  percentageChange: { type: Number, required: true },
  marketRegime: { type: String, enum: ['BULLISH', 'BEARISH', 'SIDEWAYS', 'HIGH_VOLATILITY'], required: true },
  volatility: { type: Number, required: true },
  ema20: { type: Number, required: true },
  ema50: { type: Number, required: true },
  confidenceScore: { type: Number, default: 0.91 },
  recommendedContract: { type: String, enum: ['Time Charter', 'Spot Voyage', 'COA', 'Split Procurement', 'Wait'], required: true },
  forecastSeries: [{
    date: { type: Date },
    predictedRate: { type: Number },
    upperBand: { type: Number },
    lowerBand: { type: Number },
    trend: { type: String }
  }],
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'OceanCharter AI Predictive Time-Series Engine' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Forecast', forecastSchema);
