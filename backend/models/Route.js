const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  originPort: { type: String, required: true },
  destinationPort: { type: String, required: true },
  routeName: { type: String, required: true },
  waypoints: [{
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  }],
  distanceNauticalMiles: { type: Number, required: true },
  typicalSailingDays: { type: Number, required: true },
  chokepoints: [{ type: String }], // e.g. Malacca Strait, Sunda Strait, Lombok Strait
  piracyRisk: { type: String, enum: ['NEGLIGIBLE', 'LOW', 'MODERATE'], default: 'NEGLIGIBLE' },
  monsoonVulnerability: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  historicalAverageFreightUSD: { type: Number, default: 18.5 },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'International Maritime Routing Guide' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
