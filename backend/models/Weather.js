const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  portName: { type: String, required: true },
  region: { type: String, required: true },
  date: { type: Date, default: Date.now },
  windSpeedKnots: { type: Number, default: 14 },
  waveHeightMeters: { type: Number, default: 1.8 },
  cycloneWarning: { type: Boolean, default: false },
  monsoonActive: { type: Boolean, default: false },
  riskScore: { type: Number, default: 22 }, // 0 - 100
  forecastText: { type: String, default: 'Moderate swell, operational status normal' },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'IMD (India Meteorological Department)' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Weather', weatherSchema);
