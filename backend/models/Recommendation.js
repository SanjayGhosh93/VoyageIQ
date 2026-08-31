const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  scenarioContext: { type: String, required: true },
  optimalVesselClass: { type: String, required: true },
  optimalOrigin: { type: String, required: true },
  optimalDestination: { type: String, required: true },
  optimalContractType: { type: String, required: true },
  expectedSavingsUSD: { type: Number, required: true },
  confidenceScore: { type: Number, default: 0.92 },
  reasons: [{ type: String, required: true }],
  riskMitigationPlan: [{ type: String }],
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'OceanCharter AI Multi-Objective Recommender' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
