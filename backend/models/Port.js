const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, uppercase: true },
  country: { type: String, required: true },
  region: { type: String, enum: ['East Coast India', 'Australia', 'Indonesia', 'South Africa', 'North America', 'Other'], required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  channelDraft: { type: Number, required: true }, // meters
  berthDraft: { type: Number, required: true }, // meters
  maxLOA: { type: Number, required: true }, // meters
  maxBeam: { type: Number, required: true }, // meters
  berths: { type: Number, default: 4 },
  handlingRateTPH: { type: Number, default: 1500 }, // Tons per hour
  queueLength: { type: Number, default: 3 }, // Number of vessels waiting
  averageWaitingDays: { type: Number, default: 2.5 },
  tideDependent: { type: Boolean, default: false },
  lighteringAvailable: { type: Boolean, default: false },
  transshipmentAvailable: { type: Boolean, default: false },
  compatibleVesselClasses: [{ type: String, enum: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'] }],
  cargoTypes: [{ type: String }],
  monsoonRisk: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'SEVERE'], default: 'LOW' },
  railEvacuationCapacityTPD: { type: Number, default: 35000 },
  storageYardCapacityMT: { type: Number, default: 1000000 },
  dataQuality: { 
    type: String, 
    enum: ['DEMO', 'SIMULATED', 'ESTIMATED', 'USER_PROVIDED', 'VERIFIED', 'LIVE'],
    default: 'SIMULATED' 
  },
  source: { type: String, default: 'Indian Ports Association / Port Tariffs 2026' },
  confidence: { type: Number, default: 0.92 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Port', portSchema);
