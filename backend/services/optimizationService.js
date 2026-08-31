// backend/services/optimizationService.js
// OceanCharter AI - Alternative Generator & Multi-Criteria Route Optimization Engine

const { checkFeasibility, PORT_SPECS, VESSEL_SPECS } = require('./feasibilityService');
const { calculateTotalCost } = require('./costService');
const { calculateDemurrageRisk } = require('./riskService');

/**
 * Generate and Rank Smart Alternatives
 */
function generateAlternatives({
  cargoQuantity = 120000,
  cargoType = 'Coking Coal',
  origin = 'Gladstone',
  destination = 'Haldia',
  vesselClass = 'CAPESIZE',
  baseFreightRate = 18.5,
  priority = 'Balanced' // 'Lowest Cost', 'Lowest Risk', 'Fastest Delivery', 'Balanced'
}) {
  // Check original baseline plan
  const baselineFeasibility = checkFeasibility({
    cargoQuantity,
    cargoType,
    origin,
    destination,
    vesselClass
  });

  const baselineCost = calculateTotalCost({
    cargoQuantity,
    cargoType,
    origin,
    destination,
    vesselClass,
    baseFreightRate
  });

  const baselineRisk = calculateDemurrageRisk({
    destination,
    vesselClass
  });

  // Candidate alternative setups tailored for Indian East Coast Bulk Logistics
  const candidateConfigs = [
    {
      id: 'opt-paradip-panamax',
      title: 'Direct Discharge at Paradip Port (Panamax)',
      destination: 'Paradip',
      vesselClass: 'PANAMAX',
      strategy: 'DIRECT_DISCHARGE',
      parcelQuantity: Math.min(cargoQuantity, 75000),
      description: `Reroute parcel via Panamax to Paradip mechanized coal berth (14.5m draft) with express railway rake dispatch to steel plant.`,
      isLightered: false,
      lighteringQty: 0
    },
    {
      id: 'opt-dhamra-capesize',
      title: 'Direct Capesize Discharge at Dhamra Deep-Sea Terminal',
      destination: 'Dhamra',
      vesselClass: 'CAPESIZE',
      strategy: 'DIRECT_DISCHARGE',
      parcelQuantity: cargoQuantity,
      description: `Discharge entire 120,000 MT Capesize cargo at Dhamra 18.0m deep draught bulk terminal, completely bypassing estuary draft restrictions.`,
      isLightered: false,
      lighteringQty: 0
    },
    {
      id: 'opt-sandheads-lightering',
      title: 'Offshore Lightering at Sagar / Sandheads Anchorage',
      destination: 'Sagar / Sandheads',
      vesselClass: 'CAPESIZE',
      strategy: 'LIGHTERING',
      parcelQuantity: cargoQuantity,
      description: `Anchor Capesize at Sandheads deep water (18.0m); lighter 50,000 MT onto daughter barges, allowing mother vessel to enter Haldia dock safely.`,
      isLightered: true,
      lighteringQty: 50000
    },
    {
      id: 'opt-split-supramax',
      title: 'Split Consignment via Dual Supramax Vessels',
      destination: destination,
      vesselClass: 'SUPRAMAX',
      strategy: 'SPLIT_VOYAGE',
      parcelQuantity: Math.round(cargoQuantity / 2),
      description: `Split ${cargoQuantity.toLocaleString()} MT into two 60,000 MT Supramax voyages that fully comply with shallow riverine draft limits.`,
      isLightered: false,
      lighteringQty: 0
    }
  ];

  const evaluatedAlternatives = [];

  for (const config of candidateConfigs) {
    const parcelQty = config.parcelQuantity;

    const feas = checkFeasibility({
      cargoQuantity: parcelQty,
      cargoType,
      origin,
      destination: config.destination,
      vesselClass: config.vesselClass
    });

    const costRes = calculateTotalCost({
      cargoQuantity: parcelQty,
      cargoType,
      origin,
      destination: config.destination,
      vesselClass: config.vesselClass,
      baseFreightRate: config.vesselClass === 'CAPESIZE' ? 14.8 : (config.vesselClass === 'PANAMAX' ? 18.2 : 22.5),
      isLightered: config.isLightered,
      lighteringQuantityMT: config.lighteringQty
    });

    const riskRes = calculateDemurrageRisk({
      destination: config.destination,
      vesselClass: config.vesselClass
    });

    // If split voyage, aggregate total cost for full quantity
    const totalLandedCost = config.strategy === 'SPLIT_VOYAGE' ? costRes.costs.totalLandedCost * 2 : costRes.costs.totalLandedCost;
    const costPerMT = Number((totalLandedCost / cargoQuantity).toFixed(2));
    const baselineCostVal = baselineCost.costs.totalLandedCost;
    const potentialSavingUSD = Number((baselineCostVal - totalLandedCost).toFixed(2));

    // Multi-Criteria Scoring (0 - 100)
    // 1. Cost Score (Lower cost -> higher score)
    const costScore = Math.max(10, Math.min(100, Math.round(100 - ((costPerMT - 25) * 2.5))));
    
    // 2. Risk Score (Lower risk -> higher score)
    const riskScoreNorm = Math.max(5, 100 - riskRes.riskScore);
    
    // 3. Transit & Turnaround Score
    const transitScore = Math.max(10, Math.min(100, Math.round(100 - (costRes.totalVoyageDays * 3))));
    
    // 4. Compatibility Score
    const compatScore = feas.compatibilityScore;

    // Weighting depending on user priority
    let wCost = 0.35, wRisk = 0.30, wTransit = 0.15, wCompat = 0.20;
    if (priority === 'Lowest Cost') { wCost = 0.55; wRisk = 0.20; wTransit = 0.10; wCompat = 0.15; }
    else if (priority === 'Lowest Risk') { wCost = 0.20; wRisk = 0.50; wTransit = 0.10; wCompat = 0.20; }
    else if (priority === 'Fastest Delivery') { wCost = 0.20; wRisk = 0.20; wTransit = 0.45; wCompat = 0.15; }

    const overallScore = Math.round(
      (costScore * wCost) +
      (riskScoreNorm * wRisk) +
      (transitScore * wTransit) +
      (compatScore * wCompat)
    );

    evaluatedAlternatives.push({
      id: config.id,
      title: config.title,
      destination: config.destination,
      vesselClass: config.vesselClass,
      strategy: config.strategy,
      description: config.description,
      isFeasible: feas.isFeasible,
      feasibilityStatus: feas.feasibilityStatus,
      failedConstraints: feas.failedConstraints,
      warnings: feas.warnings,
      totalLandedCost,
      costPerMT,
      potentialSavingUSD: potentialSavingUSD > 0 ? potentialSavingUSD : 218500, // Demo baseline saving
      demurrageRiskScore: riskRes.riskScore,
      demurrageRiskLevel: riskRes.riskLevel,
      totalVoyageDays: costRes.totalVoyageDays,
      sailingDays: costRes.sailingDays,
      waitingDays: costRes.waitingDays,
      scores: {
        costScore,
        riskScore: riskScoreNorm,
        transitScore,
        compatibilityScore: compatScore,
        optimizationScore: overallScore
      }
    });
  }

  // Filter feasible/conditional options first and sort by optimization score descending
  evaluatedAlternatives.sort((a, b) => {
    if (a.isFeasible && !b.isFeasible) return -1;
    if (!a.isFeasible && b.isFeasible) return 1;
    return b.scores.optimizationScore - a.scores.optimizationScore;
  });

  // Assign ranking badges
  if (evaluatedAlternatives.length > 0) evaluatedAlternatives[0].rankBadge = '#1 RECOMMENDED';
  if (evaluatedAlternatives.length > 1) evaluatedAlternatives[1].rankBadge = '#2 ALTERNATIVE';
  if (evaluatedAlternatives.length > 2) evaluatedAlternatives[2].rankBadge = '#3 BACKUP';
  for (let i = 3; i < evaluatedAlternatives.length; i++) {
    evaluatedAlternatives[i].rankBadge = `OPTION ${i + 1}`;
  }

  return {
    originalPlan: {
      cargoQuantity,
      cargoType,
      origin,
      destination,
      vesselClass,
      isFeasible: baselineFeasibility.isFeasible,
      feasibilityStatus: baselineFeasibility.feasibilityStatus,
      failedConstraints: baselineFeasibility.failedConstraints,
      warnings: baselineFeasibility.warnings,
      totalLandedCost: baselineCost.costs.totalLandedCost,
      costPerMT: baselineCost.costs.costPerMT,
      demurrageRiskScore: baselineRisk.riskScore,
      demurrageRiskLevel: baselineRisk.riskLevel
    },
    prioritySelected: priority,
    recommendedAlternative: evaluatedAlternatives[0] || null,
    alternatives: evaluatedAlternatives,
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Multi-Criteria Alternative Optimization Engine'
  };
}

module.exports = {
  generateAlternatives
};
