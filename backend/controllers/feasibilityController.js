// backend/controllers/feasibilityController.js
const { checkFeasibility } = require('../services/feasibilityService');
const { calculateTotalCost } = require('../services/costService');
const { calculateDemurrageRisk } = require('../services/riskService');
const { generateAlternatives } = require('../services/optimizationService');
const { generateAIRecommendation } = require('../services/recommendationService');
const { forecastFreightRates } = require('../services/forecastService');

// @desc Evaluate vessel-port feasibility and return alternatives if failed
// @route POST /api/feasibility/check
const checkFeasibilityEndpoint = async (req, res, next) => {
  try {
    const {
      cargoQuantity = 70000,
      cargoType = 'Coking Coal',
      origin = 'Gladstone',
      destination = 'Paradip',
      vesselClass = 'PANAMAX',
      priority = 'Balanced'
    } = req.body;

    const parsedQty = parseFloat(cargoQuantity) || 70000;

    // 1. Feasibility Constraint Evaluation
    const feasibilityResult = checkFeasibility({
      cargoQuantity: parsedQty,
      cargoType,
      origin,
      destination,
      vesselClass
    });

    // 2. Cost Analysis
    const costResult = calculateTotalCost({
      cargoQuantity: parsedQty,
      cargoType,
      origin,
      destination,
      vesselClass
    });

    // 3. Demurrage Risk Evaluation
    const riskResult = calculateDemurrageRisk({
      destination,
      vesselClass
    });

    // 4. Freight Forecast for context
    const forecastResult = forecastFreightRates({
      origin,
      destination,
      vesselClass,
      cargoType,
      cargoQuantity: parsedQty,
      horizonDays: 30
    });

    // 5. Generate Smart Alternatives
    const alternativePack = generateAlternatives({
      cargoQuantity: parsedQty,
      cargoType,
      origin,
      destination,
      vesselClass,
      priority
    });

    // 6. Explainable AI Recommendation
    const aiRecommendation = generateAIRecommendation({
      scenarioContext: { origin, destination, vesselClass, cargoQuantity: parsedQty },
      feasibilityResult,
      forecastResult,
      costResult,
      riskResult,
      bestAlternative: alternativePack.recommendedAlternative
    });

    res.json({
      success: true,
      feasibilityStatus: feasibilityResult.feasibilityStatus,
      isFeasible: feasibilityResult.isFeasible,
      failedConstraints: feasibilityResult.failedConstraints,
      warnings: feasibilityResult.warnings,
      compatibilityScore: feasibilityResult.compatibilityScore,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      costEstimate: costResult,
      feasibilityDetails: feasibilityResult.details,
      portSpecs: feasibilityResult.portSpecs,
      vesselSpecs: feasibilityResult.vesselSpecs,
      alternatives: alternativePack.alternatives,
      recommendedAlternative: alternativePack.recommendedAlternative,
      aiRecommendation,
      dataQuality: 'SIMULATED',
      disclaimer: 'ILLUSTRATIVE SIMULATION'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkFeasibilityEndpoint
};
