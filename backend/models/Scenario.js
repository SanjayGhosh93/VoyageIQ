const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cargoType: { type: String, default: 'Coking Coal' },
  cargoQuantityMT: { type: Number, required: true },
  originPort: { type: String, required: true },
  destinationPort: { type: String, required: true },
  vesselClass: { type: String, enum: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'], required: true },
  contractType: { type: String, enum: ['Spot Voyage', 'Time Charter', 'COA'], default: 'Spot Voyage' },
  
  // Results & Outputs
  isFeasible: { type: Boolean, default: true },
  feasibilityStatus: { type: String, enum: ['FEASIBLE', 'INFEASIBLE', 'CONDITIONAL'], default: 'FEASIBLE' },
  failedConstraints: [{ type: String }],
  warnings: [{ type: String }],
  compatibilityScore: { type: Number, default: 85 },
  riskScore: { type: Number, default: 28 }, // 0 - 100
  
  // Financial & Operational Metrics
  freightRateUSDPerMT: { type: Number, default: 18.5 },
  oceanFreightCostUSD: { type: Number, default: 0 },
  bunkerCostUSD: { type: Number, default: 0 },
  portTariffCostUSD: { type: Number, default: 0 },
  handlingCostUSD: { type: Number, default: 0 },
  lighteringCostUSD: { type: Number, default: 0 },
  demurrageExposureUSD: { type: Number, default: 0 },
  totalLandedCostUSD: { type: Number, default: 0 },
  costPerMT: { type: Number, default: 0 },
  transitDays: { type: Number, default: 14 },
  waitingDays: { type: Number, default: 2.5 },
  dischargeDays: { type: Number, default: 3 },
  totalVoyageDays: { type: Number, default: 19.5 },
  optimizationScore: { type: Number, default: 88 },
  
  // Alternatives & Explanations
  recommendedAction: { type: String },
  whyDecision: [{ type: String }],
  alternatives: [{
    title: { type: String },
    destination: { type: String },
    vesselClass: { type: String },
    totalLandedCostUSD: { type: Number },
    costPerMT: { type: Number },
    demurrageRisk: { type: Number },
    feasibilityStatus: { type: String },
    optimizationScore: { type: Number },
    badge: { type: String }
  }],
  
  tag: { type: String, enum: ['BASELINE', 'BEST_VALUE', 'LOWEST_RISK', 'FASTEST', 'ALTERNATIVE', 'INFEASIBLE'], default: 'BASELINE' },
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'OceanCharter AI Optimization Engine' },
  confidence: { type: Number, default: 0.94 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scenario', scenarioSchema);
