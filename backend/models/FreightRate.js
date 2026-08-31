const mongoose = require('mongoose');

const freightRateSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  origin: { type: String, required: true, index: true },
  destination: { type: String, required: true, index: true },
  vesselClass: { type: String, enum: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'], required: true, index: true },
  cargoType: { type: String, default: 'Coking Coal' },
  ratePerMT: { type: Number, required: true }, // USD per Metric Ton
  ema20: { type: Number },
  ema50: { type: Number },
  volatility: { type: Number },
  fuelPriceVLSFO: { type: Number },
  marketIndexBDI: { type: Number },
  weatherRiskScore: { type: Number, default: 20 },
  congestionIndex: { type: Number, default: 25 },
  eventNote: { type: String, default: null },
  dataQuality: { 
    type: String, 
    enum: ['DEMO', 'SIMULATED', 'ESTIMATED', 'USER_PROVIDED', 'VERIFIED', 'LIVE'],
    default: 'SIMULATED' 
  },
  source: { type: String, default: 'Baltic Dry Index & Synthetic OceanCharter Engine' },
  confidence: { type: Number, default: 0.94 }
}, {
  timestamps: true
});

module.exports = mongoose.model('FreightRate', freightRateSchema);
