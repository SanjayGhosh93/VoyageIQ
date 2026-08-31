// backend/controllers/reportController.js
const { checkFeasibility } = require('../services/feasibilityService');
const { calculateTotalCost } = require('../services/costService');
const { calculateDemurrageRisk } = require('../services/riskService');
const { forecastFreightRates } = require('../services/forecastService');
const { generateAlternatives } = require('../services/optimizationService');
const { generateAIRecommendation } = require('../services/recommendationService');

// @desc Generate comprehensive executive voyage brief / audit report
// @route POST /api/reports
const generateReport = async (req, res, next) => {
  try {
    const {
      title = 'Bulk Cargo Chartering Executive Decision Report',
      cargoType = 'Coking Coal',
      cargoQuantity = 120000,
      origin = 'Gladstone',
      destination = 'Haldia',
      vesselClass = 'CAPESIZE',
      generatedBy = 'Procurement Specialist'
    } = req.body;

    const parsedQty = parseFloat(cargoQuantity) || 120000;

    const feas = checkFeasibility({ cargoQuantity: parsedQty, cargoType, origin, destination, vesselClass });
    const costRes = calculateTotalCost({ cargoQuantity: parsedQty, cargoType, origin, destination, vesselClass });
    const riskRes = calculateDemurrageRisk({ destination, vesselClass });
    const forecastRes = forecastFreightRates({ origin, destination, vesselClass, cargoQuantity: parsedQty, horizonDays: 30 });
    const altPack = generateAlternatives({ cargoQuantity: parsedQty, cargoType, origin, destination, vesselClass });
    const aiRec = generateAIRecommendation({
      scenarioContext: { origin, destination, vesselClass, cargoQuantity: parsedQty },
      feasibilityResult: feas,
      forecastResult: forecastRes,
      costResult: costRes,
      riskResult: riskRes,
      bestAlternative: altPack.recommendedAlternative
    });

    const reportId = `OC-REP-${Date.now().toString().slice(-6)}`;

    const report = {
      reportId,
      title,
      generatedAt: new Date().toISOString(),
      generatedBy,
      organization: 'Steel Authority of India Limited (SAIL)',
      parameters: {
        cargoType,
        cargoQuantityMT: parsedQty,
        origin,
        destination,
        vesselClass
      },
      feasibilityResult: {
        status: feas.feasibilityStatus,
        isFeasible: feas.isFeasible,
        failedConstraints: feas.failedConstraints,
        warnings: feas.warnings,
        compatibilityScore: feas.compatibilityScore,
        details: feas.details
      },
      marketForecastSummary: {
        currentRate: forecastRes.currentRate,
        projectedRate: forecastRes.projectedRate,
        percentageChange: forecastRes.percentageChange,
        marketRegime: forecastRes.marketRegime,
        volatility: forecastRes.volatility,
        recommendedContract: forecastRes.recommendedContract
      },
      costBreakdown: {
        oceanFreight: costRes.costs.oceanFreightCost,
        bunkerCost: costRes.costs.bunkerCost,
        portTariffs: costRes.costs.portTariffCost,
        handlingCost: costRes.costs.handlingCost,
        lighteringCost: costRes.costs.lighteringCost,
        demurrageExposure: costRes.costs.expectedDemurrageCost,
        totalLandedCost: costRes.costs.totalLandedCost,
        costPerMT: costRes.costs.costPerMT
      },
      riskSummary: {
        demurrageRiskScore: riskRes.riskScore,
        riskLevel: riskRes.riskLevel,
        topContributors: riskRes.topContributors
      },
      alternativesSummary: altPack.alternatives.map((alt, idx) => ({
        optionName: alt.title,
        route: `${origin} → ${alt.destination}`,
        vessel: alt.vesselClass,
        strategy: alt.strategy,
        totalLandedCost: alt.totalLandedCost,
        costPerMT: alt.costPerMT,
        savingVsBaselineUSD: alt.potentialSavingUSD,
        demurrageRisk: alt.demurrageRiskScore,
        feasibility: alt.feasibilityStatus,
        rank: alt.rankBadge || `OPTION ${idx + 1}`
      })),
      executiveRecommendation: {
        decision: aiRec.title,
        recommendedVessel: aiRec.recommendedVessel,
        recommendedDestination: aiRec.recommendedDestination,
        why: aiRec.whyReasons,
        explainabilityMatrix: aiRec.explainabilityMatrix,
        actionPlan: aiRec.actionSteps,
        potentialSavingUSD: aiRec.potentialSavingUSD
      },
      dataQuality: 'SIMULATED',
      disclaimer: 'OceanCharter AI is an SIH 2026 prototype. Operational constraints, freight rates, weather, congestion and cost figures shown in demo mode may be simulated or illustrative and must be verified against authoritative sources before commercial decisions.'
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateReport
};
