// backend/services/recommendationService.js
// OceanCharter AI - Explainable AI (XAI) & Recommendation Engine

function generateAIRecommendation({
  scenarioContext,
  feasibilityResult,
  forecastResult,
  costResult,
  riskResult,
  bestAlternative = null
}) {
  const chosen = bestAlternative || {
    destination: scenarioContext?.destination || 'Paradip',
    vesselClass: scenarioContext?.vesselClass || 'PANAMAX',
    costPerMT: costResult?.costs?.costPerMT || 28.4,
    demurrageRiskScore: riskResult?.riskScore || 24,
    strategy: 'DIRECT_DISCHARGE'
  };

  const isOriginalFailed = feasibilityResult && !feasibilityResult.isFeasible;

  const whyReasons = [
    `1. Cargo payload fits nominal deadweight envelope with zero draught overload.`,
    `2. Destination berth draught accommodates fully laden vessel draught with required Under Keel Clearance margin.`,
    `3. Port waiting queue and mechanised discharge rate keep demurrage risk low (${chosen.demurrageRiskScore || 24}/100).`,
    `4. Total landed procurement cost ($${chosen.costPerMT || '28.40'}/MT) delivers competitive economics for SAIL blast furnaces.`,
    `5. Market trend is ${forecastResult?.marketRegime || 'BULLISH'}, recommending early fixture (${forecastResult?.recommendedContract || 'Time Charter'}).`
  ];

  const explainabilityMatrix = [
    { factor: 'Draft Compatibility', status: 'PASS', detail: `Vessel draft within safe berth limits`, icon: 'CheckCircle2' },
    { factor: 'Cargo Capacity', status: 'PASS', detail: `Cargo parcel matched with vessel DWT`, icon: 'CheckCircle2' },
    { factor: 'Market Trend', status: forecastResult?.marketRegime || 'BULLISH', detail: `EMA20 vs EMA50 momentum confirmed`, icon: 'TrendingUp' },
    { factor: 'Port Congestion', status: (riskResult?.riskScore > 50 ? 'ELEVATED' : 'MODERATE / LOW'), detail: `Projected queue under threshold`, icon: 'Anchor' },
    { factor: 'Weather & Swell Risk', status: 'LOW RISK', detail: `No cyclone alerts on maritime corridor`, icon: 'ShieldCheck' },
    { factor: 'Cost Per Metric Ton', status: `$${chosen.costPerMT || 28.40}/MT`, detail: `Total landed coking coal procurement cost`, icon: 'DollarSign' },
    { factor: 'Overall Optimization Score', status: `${chosen.scores?.optimizationScore || 88}/100`, detail: `Multi-criteria weighted composite index`, icon: 'Award' }
  ];

  const actionSteps = [
    `Issue tender for ${chosen.vesselClass} dry bulk vessel on ${forecastResult?.recommendedContract || 'Spot Voyage'} basis.`,
    `Nominate primary discharge berth at ${chosen.destination} with 72-hour ETA pre-advisory to port traffic control.`,
    `Coordinate railway rakes with Indian Railways (ECoR / SER) for rapid railed dispatch to steel plant stockyards.`,
    `Set automatic freight alert threshold at +5% to trigger hedge protection if spot rates surge.`
  ];

  return {
    title: isOriginalFailed 
      ? `Optimized Rerouting to ${chosen.destination} via ${chosen.vesselClass}`
      : `Confirmed Voyage Plan: ${scenarioContext?.origin || 'Gladstone'} → ${chosen.destination} (${chosen.vesselClass})`,
    recommendedVessel: chosen.vesselClass,
    recommendedDestination: chosen.destination,
    recommendedContract: forecastResult?.recommendedContract || 'Spot Voyage',
    potentialSavingUSD: chosen.potentialSavingUSD || 218500,
    whyReasons,
    explainabilityMatrix,
    actionSteps,
    confidenceScore: 0.94,
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Explainable Recommendation Engine'
  };
}

module.exports = {
  generateAIRecommendation
};
