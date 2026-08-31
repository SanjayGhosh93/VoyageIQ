const mongoose = require('mongoose');

const congestionSchema = new mongoose.Schema({
  portName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  vesselsAtAnchorage: { type: Number, default: 4 },
  vesselsAtBerth: { type: Number, default: 3 },
  averageWaitingHours: { type: Number, default: 48 },
  averageTurnaroundHours: { type: Number, default: 72 },
  berthOccupancyRate: { type: Number, default: 78.5 }, // percentage
  congestionLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'MODERATE' },
  railRakesAvailable: { type: Number, default: 12 },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'Port Trust Daily Vessel Movement Log' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Congestion', congestionSchema);
