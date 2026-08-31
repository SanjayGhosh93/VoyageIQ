const { PORT_SPECS, VESSEL_SPECS } = require('./feasibilityService');

// Official UNCTAD / Kaggle Maritime Trade & Port Performance Benchmarks (Dry Bulk Carrier Segment)
const UNCTAD_COUNTRY_BENCHMARKS = {
  Australia: {
    medianTurnaroundDays: 1.66,
    avgDWT: 112354,
    maxDWT: 297902,
    avgVesselAgeYears: 11,
    efficiencyRating: 'EXCELLENT',
    primaryVesselClasses: ['CAPESIZE', 'PANAMAX']
  },
  Indonesia: {
    medianTurnaroundDays: 2.64,
    avgDWT: 45622,
    maxDWT: 211135,
    avgVesselAgeYears: 18,
    efficiencyRating: 'MODERATE',
    primaryVesselClasses: ['SUPRAMAX', 'HANDYSIZE', 'PANAMAX']
  },
  'United States of America': {
    medianTurnaroundDays: 2.24,
    avgDWT: 52571,
    maxDWT: 209854,
    avgVesselAgeYears: 19,
    efficiencyRating: 'GOOD',
    primaryVesselClasses: ['PANAMAX', 'SUPRAMAX']
  },
  'Russian Federation': {
    medianTurnaroundDays: 2.83,
    avgDWT: 47020,
    maxDWT: 206204,
    avgVesselAgeYears: 18,
    efficiencyRating: 'MODERATE_DELAY_EXPOSURE',
    primaryVesselClasses: ['PANAMAX', 'SUPRAMAX', 'HANDYSIZE']
  },
  China: {
    medianTurnaroundDays: 2.01,
    avgDWT: 78633,
    maxDWT: 404389,
    avgVesselAgeYears: 14,
    efficiencyRating: 'HIGH_VOLUME',
    primaryVesselClasses: ['CAPESIZE', 'PANAMAX']
  },
  World: {
    medianTurnaroundDays: 2.14,
    avgDWT: 58288,
    maxDWT: 404389,
    avgVesselAgeYears: 14,
    efficiencyRating: 'GLOBAL_AVERAGE'
  }
};

/**
 * Calculate Demurrage Risk Score and Factors with UNCTAD Calibration
 */
function calculateDemurrageRisk({
  origin = 'Australia',
  destination = 'Paradip',
  vesselClass = 'PANAMAX',
  weatherScore = 20, // 0 - 100 (100 is severe cyclone)
  overrideQueue = null,
  overrideMonsoon = null,
  isTideDependent = null
}) {
  const port = PORT_SPECS[destination] || PORT_SPECS['Paradip'];
  const vessel = VESSEL_SPECS[vesselClass] || VESSEL_SPECS['PANAMAX'];
  const unctadOrigin = UNCTAD_COUNTRY_BENCHMARKS[origin] || UNCTAD_COUNTRY_BENCHMARKS['Australia'];

  // Factor 1: Monsoon Risk (Weight: 15%)
  const monsoonLevel = overrideMonsoon || port.monsoonRisk || 'LOW';
  let monsoonScore = 15;
  if (monsoonLevel === 'SEVERE') monsoonScore = 95;
  else if (monsoonLevel === 'HIGH') monsoonScore = 75;
  else if (monsoonLevel === 'MODERATE') monsoonScore = 45;
  else monsoonScore = 15;

  // Factor 2: Port Queue Congestion (Weight: 20%)
  const queueLen = overrideQueue !== null ? overrideQueue : port.queueLength;
  const queueRatio = queueLen / Math.max(1, port.berths);
  let queueScore = Math.min(100, Math.round(queueRatio * 60));

  // Factor 3: Weather & Swell (Weight: 20%)
  const weatherRiskScore = Math.min(100, Math.max(5, weatherScore));

  // Factor 4: Berth Availability / Flexibility (Weight: 15%)
  let berthScore = 20;
  if (port.berths <= 4) berthScore = 70;
  else if (port.berths <= 8) berthScore = 45;
  else berthScore = 20;
  if (port.tideDependent) berthScore += 15;

  // Factor 5: Vessel-Port Compatibility & Draft Margin (Weight: 20%)
  let compatScore = 10;
  const draftDelta = port.berthDraft - vessel.draft;
  if (draftDelta < 0) {
    compatScore = 100; // Infeasible/unsafe
  } else if (draftDelta < 1.0) {
    compatScore = 80;
  } else if (draftDelta < 2.0) {
    compatScore = 45;
  } else {
    compatScore = 15;
  }

  // Factor 6: Handling Rate & Discharge Velocity (Weight: 10%)
  const handlingRate = port.handlingRateTPH || 1500;
  let handlingScore = 20;
  if (handlingRate < 1000) handlingScore = 75;
  else if (handlingRate < 1500) handlingScore = 40;
  else handlingScore = 15;

  // Weighted Composite Risk Calculation (0 - 100)
  const rawRisk = (
    (monsoonScore * 0.15) +
    (queueScore * 0.20) +
    (weatherRiskScore * 0.20) +
    (berthScore * 0.15) +
    (compatScore * 0.20) +
    (handlingScore * 0.10)
  );

  const riskScore = Math.min(100, Math.max(5, Math.round(rawRisk)));

  // Risk Classification
  let riskLevel = 'LOW';
  let riskBadgeColor = 'emerald';
  let mitigationAdvice = 'Standard demurrage risk profile. No abnormal delays projected.';

  if (riskScore >= 76) {
    riskLevel = 'CRITICAL';
    riskBadgeColor = 'rose';
    mitigationAdvice = 'High likelihood of heavy demurrage claims (> $80,000). Reroute to alternative deepwater port or arrange pre-berthing lightering.';
  } else if (riskScore >= 51) {
    riskLevel = 'HIGH';
    riskBadgeColor = 'amber';
    mitigationAdvice = 'Noticeable demurrage exposure expected. Negotiate extended laytime allowance (+24 hrs) in charter party agreement.';
  } else if (riskScore >= 26) {
    riskLevel = 'MODERATE';
    riskBadgeColor = 'blue';
    mitigationAdvice = 'Moderate waiting expected during seasonal shifts. Monitor daily 72-hour port lineup notices.';
  }

  // Top Risk Contributors
  const contributorList = [
    { factor: 'Vessel Draft / Port Margin', contribution: Math.round(compatScore * 0.20), rawScore: compatScore, description: `${vessel.draft}m draft vs ${port.berthDraft}m berth draft` },
    { factor: 'Port Queue & Congestion', contribution: Math.round(queueScore * 0.20), rawScore: queueScore, description: `${queueLen} vessels in queue for ${port.berths} berths` },
    { factor: 'Weather & Swell Advisory', contribution: Math.round(weatherRiskScore * 0.20), rawScore: weatherRiskScore, description: `Maritime wave & wind activity level` },
    { factor: 'Monsoon Impact', contribution: Math.round(monsoonScore * 0.15), rawScore: monsoonScore, description: `Seasonal monsoon intensity: ${monsoonLevel}` },
    { factor: 'Berth Availability / Tidal Constraints', contribution: Math.round(berthScore * 0.15), rawScore: berthScore, description: `${port.berths} total berths (${port.tideDependent ? 'Tide Dependent' : 'Non-tidal'})` },
    { factor: 'Handling Rate Efficiency', contribution: Math.round(handlingScore * 0.10), rawScore: handlingScore, description: `${handlingRate} TPH mechanised discharge rate` }
  ];

  contributorList.sort((a, b) => b.contribution - a.contribution);

  return {
    destination,
    vesselClass,
    riskScore,
    riskLevel,
    riskBadgeColor,
    mitigationAdvice,
    topContributors: contributorList,
    subScores: {
      monsoon: monsoonScore,
      queue: queueScore,
      weather: weatherRiskScore,
      berth: berthScore,
      compatibility: compatScore,
      handling: handlingScore
    },
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Demurrage Risk Engine',
    disclaimer: 'ILLUSTRATIVE SIMULATION'
  };
}

module.exports = {
  calculateDemurrageRisk
};
