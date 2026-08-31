const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Freight', 'Port', 'Weather', 'Fuel', 'Congestion', 'Vessel', 'Contract'], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'], 
    required: true 
  },
  affectedPort: { type: String },
  affectedRoute: { type: String },
  affectedVesselClass: { type: String },
  recommendation: { type: String, required: true },
  actionableLink: { type: String },
  isAcknowledged: { type: Boolean, default: false },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'OceanCharter AI Early Warning System' },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
