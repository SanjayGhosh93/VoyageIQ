const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imoNumber: { type: String, unique: true },
  vesselClass: { 
    type: String, 
    enum: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    required: true 
  },
  dwt: { type: Number, required: true }, // Deadweight tonnage (MT)
  draft: { type: Number, required: true }, // Loaded draft (m)
  ballastDraft: { type: Number, default: 6.5 },
  loa: { type: Number, required: true }, // Length overall (m)
  beam: { type: Number, required: true }, // Beam width (m)
  serviceSpeedKnots: { type: Number, default: 13.5 },
  fuelConsumptionAtSeaTPD: { type: Number, default: 32 }, // Fuel metric tons/day at sea
  fuelConsumptionInPortTPD: { type: Number, default: 3.5 },
  demurrageRatePerDayUSD: { type: Number, default: 18000 },
  dailyHireRateUSD: { type: Number, default: 22000 },
  buildYear: { type: Number, default: 2018 },
  flag: { type: String, default: 'Panama' },
  status: { type: String, enum: ['AVAILABLE', 'ON_VOYAGE', 'DISCHARGING', 'IDLE', 'MAINTENANCE'], default: 'AVAILABLE' },
  currentLocation: {
    port: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  dataQuality: { 
    type: String, 
    enum: ['DEMO', 'SIMULATED', 'ESTIMATED', 'USER_PROVIDED', 'VERIFIED', 'LIVE'],
    default: 'DEMO' 
  },
  source: { type: String, default: 'Clarksons Shipping Intelligence / Baltic Exchange' },
  confidence: { type: Number, default: 0.95 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vessel', vesselSchema);
