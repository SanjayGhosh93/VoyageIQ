const mongoose = require('mongoose');

const marketIndexSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  bdi: { type: Number, required: true }, // Baltic Dry Index
  bci: { type: Number, required: true }, // Baltic Capesize Index
  bpi: { type: Number, required: true }, // Baltic Panamax Index
  bsi: { type: Number, required: true }, // Baltic Supramax Index
  bhsi: { type: Number, required: true }, // Baltic Handysize Index
  sentiment: { type: String, enum: ['BULLISH', 'BEARISH', 'SIDEWAYS', 'HIGH_VOLATILITY'], default: 'SIDEWAYS' },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'Baltic Exchange London' }
}, {
  timestamps: true
});

module.exports = mongoose.model('MarketIndex', marketIndexSchema);
