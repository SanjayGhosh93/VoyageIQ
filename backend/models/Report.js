const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  generatedBy: { type: String, default: 'Procurement Specialist' },
  organization: { type: String, default: 'Steel Authority of India Limited (SAIL)' },
  parameters: {
    cargoType: { type: String },
    cargoQuantityMT: { type: Number },
    origin: { type: String },
    destination: { type: String },
    vesselClass: { type: String }
  },
  feasibilityResult: {
    status: { type: String },
    failedConstraints: [{ type: String }],
    compatibilityScore: { type: Number }
  },
  marketForecastSummary: {
    currentRate: { type: Number },
    projectedRate: { type: Number },
    marketRegime: { type: String },
    recommendedContract: { type: String }
  },
  costBreakdown: {
    oceanFreight: { type: Number },
    bunkerCost: { type: Number },
    portTariffs: { type: Number },
    handlingCost: { type: Number },
    lighteringCost: { type: Number },
    demurrageExposure: { type: Number },
    totalLandedCost: { type: Number },
    costPerMT: { type: Number }
  },
  riskSummary: {
    demurrageRiskScore: { type: Number },
    riskLevel: { type: String },
    topContributors: [{ type: String }]
  },
  alternativesSummary: [{
    optionName: { type: String },
    route: { type: String },
    vessel: { type: String },
    costPerMT: { type: Number },
    savingVsBaselineUSD: { type: Number },
    feasibility: { type: String },
    rank: { type: String }
  }],
  executiveRecommendation: {
    decision: { type: String },
    why: [{ type: String }],
    actionPlan: [{ type: String }]
  },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'OceanCharter AI Executive Report Engine' },
  disclaimer: { 
    type: String, 
    default: 'OceanCharter AI is an SIH 2026 prototype. Operational constraints, freight rates, weather, congestion and cost figures shown in demo mode may be simulated or illustrative and must be verified against authoritative sources before commercial decisions.' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
