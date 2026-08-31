// backend/services/costService.js
// OceanCharter AI - Total Landed Cost & Sensitivity Calculation Engine

// Maritime Distance (Nautical Miles) Matrix
const DISTANCES_NM = {
  'Gladstone-Paradip': 5100,
  'Gladstone-Haldia': 5250,
  'Gladstone-Dhamra': 5180,
  'Gladstone-Visakhapatnam': 4950,
  'Gladstone-Gangavaram': 4930,
  'Gladstone-Gopalpur': 5050,
  'Gladstone-Chennai': 4750,
  'Gladstone-Kamarajar': 4770,
  'Gladstone-Sagar / Sandheads': 5220,

  'Newcastle-Paradip': 5400,
  'Newcastle-Haldia': 5550,
  'Newcastle-Dhamra': 5480,
  'Newcastle-Visakhapatnam': 5250,

  'Banjarmasin-Paradip': 2100,
  'Banjarmasin-Haldia': 2250,
  'Banjarmasin-Dhamra': 2180,
  'Banjarmasin-Visakhapatnam': 1980,

  'Maputo-Paradip': 4400,
  'Maputo-Haldia': 4550,
  'Maputo-Visakhapatnam': 4250,

  'Beira-Paradip': 4200,
  'Beira-Haldia': 4350,
  'Beira-Visakhapatnam': 4050,

  'Baltimore-Paradip': 9800,
  'Baltimore-Haldia': 9950,
  'Baltimore-Visakhapatnam': 9650,

  'Hampton Roads-Paradip': 9600,
  'Hampton Roads-Haldia': 9750,
  'Hampton Roads-Visakhapatnam': 9450,

  'Vostochny-Paradip': 5600,
  'Vostochny-Haldia': 5750,
  'Vostochny-Visakhapatnam': 5450,

  'Taman-Paradip': 5100,
  'Taman-Haldia': 5250,
  'Taman-Visakhapatnam': 4950
};

function getDistanceNM(origin, destination) {
  const key1 = `${origin}-${destination}`;
  const key2 = `${destination}-${origin}`;
  return DISTANCES_NM[key1] || DISTANCES_NM[key2] || 5000;
}

/**
 * Calculate Total Landed Cost with optional sensitivity modifiers
 */
function calculateTotalCost({
  cargoQuantity = 70000,
  cargoType = 'Coking Coal',
  origin = 'Gladstone',
  destination = 'Paradip',
  vesselClass = 'PANAMAX',
  contractType = 'Spot Voyage',
  baseFreightRate = 18.42, // USD/MT
  baseFuelPrice = 620, // USD/MT VLSFO
  demurrageRatePerDay = 20000, // USD/Day
  expectedWaitingDays = 2.5,
  handlingRateTPH = 1500,
  isLightered = false,
  lighteringQuantityMT = 0,
  // What-If Sliders
  fuelPriceDeltaPct = 0, // e.g. -15 to +15
  freightRateDeltaPct = 0, // e.g. -10 to +10
  overrideWaitingDays = null
}) {
  const distanceNM = getDistanceNM(origin, destination);
  const effectiveFreightRate = baseFreightRate * (1 + freightRateDeltaPct / 100);
  const effectiveFuelPrice = baseFuelPrice * (1 + fuelPriceDeltaPct / 100);
  const effectiveWaitingDays = overrideWaitingDays !== null ? overrideWaitingDays : expectedWaitingDays;

  // Speeds and fuel burns by vessel class
  const classProfiles = {
    HANDYSIZE: { speed: 13.0, seaBurn: 18, portBurn: 3, portTariffBase: 42000, handlingRate: 900, defaultDemurrage: 12000 },
    SUPRAMAX: { speed: 13.5, seaBurn: 26, portBurn: 3.5, portTariffBase: 58000, handlingRate: 1200, defaultDemurrage: 16000 },
    PANAMAX: { speed: 13.5, seaBurn: 32, portBurn: 4.0, portTariffBase: 78000, handlingRate: 1500, defaultDemurrage: 20000 },
    CAPESIZE: { speed: 14.0, seaBurn: 48, portBurn: 5.5, portTariffBase: 118000, handlingRate: 2200, defaultDemurrage: 30000 }
  };

  const profile = classProfiles[vesselClass] || classProfiles['PANAMAX'];
  const activeDemurrageRate = demurrageRatePerDay || profile.defaultDemurrage;

  // 1. Transit and Port Duration Calculations
  const sailingHours = distanceNM / profile.speed;
  const sailingDays = Number((sailingHours / 24).toFixed(1));
  const effectiveHandlingRate = handlingRateTPH || profile.handlingRate;
  const dischargeHours = cargoQuantity / effectiveHandlingRate;
  const dischargeDays = Number((dischargeHours / 24).toFixed(1));
  const totalPortDays = Number((effectiveWaitingDays + dischargeDays).toFixed(1));
  const totalVoyageDays = Number((sailingDays + totalPortDays).toFixed(1));

  // 2. Component Costs Breakdown
  // A. Ocean Freight
  const oceanFreightCost = Number((cargoQuantity * effectiveFreightRate).toFixed(2));

  // B. Bunker Fuel Cost (One way voyage consumption + port idling)
  const seaFuelConsumed = sailingDays * profile.seaBurn;
  const portFuelConsumed = totalPortDays * profile.portBurn;
  const totalFuelMT = Number((seaFuelConsumed + portFuelConsumed).toFixed(1));
  const bunkerCost = Number((totalFuelMT * effectiveFuelPrice).toFixed(2));

  // C. Port Dues & Tariffs (Berth hire, pilotage, tugs, port trust charges)
  const portTariffCost = Number(profile.portTariffBase.toFixed(2));

  // D. Cargo Handling & Stevedoring ($3.20 per MT average bulk handling)
  const handlingCost = Number((cargoQuantity * 3.20).toFixed(2));

  // E. Lightering & Transshipment (if applicable, e.g. Sandheads barge lightering @ $7.50/MT)
  let lighteringCost = 0;
  if (isLightered || lighteringQuantityMT > 0) {
    const qtyToLighter = lighteringQuantityMT || (cargoQuantity * 0.45);
    lighteringCost = Number((qtyToLighter * 7.50).toFixed(2));
  }

  // F. Expected Demurrage Exposure
  // If waiting exceeds standard laytime allowance (usually 2 days allowed)
  const laytimeAllowedDays = 2.0;
  const excessDelayDays = Math.max(0, effectiveWaitingDays - laytimeAllowedDays);
  const expectedDemurrageCost = Number((excessDelayDays * activeDemurrageRate).toFixed(2));

  // G. Total Landed Cost Sum
  const totalLandedCost = Number((
    oceanFreightCost +
    bunkerCost +
    portTariffCost +
    handlingCost +
    lighteringCost +
    expectedDemurrageCost
  ).toFixed(2));

  const costPerMT = Number((totalLandedCost / cargoQuantity).toFixed(2));

  // Cost Breakdown for visual UI pie/bar charts
  const costBreakdown = [
    { name: 'Ocean Freight', amount: oceanFreightCost, percentage: Number(((oceanFreightCost / totalLandedCost) * 100).toFixed(1)), color: '#38bdf8' },
    { name: 'Bunker Fuel', amount: bunkerCost, percentage: Number(((bunkerCost / totalLandedCost) * 100).toFixed(1)), color: '#fbbf24' },
    { name: 'Handling & Stevedoring', amount: handlingCost, percentage: Number(((handlingCost / totalLandedCost) * 100).toFixed(1)), color: '#34d399' },
    { name: 'Port Dues & Tariffs', amount: portTariffCost, percentage: Number(((portTariffCost / totalLandedCost) * 100).toFixed(1)), color: '#a78bfa' },
    { name: 'Demurrage Exposure', amount: expectedDemurrageCost, percentage: Number(((expectedDemurrageCost / totalLandedCost) * 100).toFixed(1)), color: '#f87171' },
    ...(lighteringCost > 0 ? [{ name: 'Lightering & Barging', amount: lighteringCost, percentage: Number(((lighteringCost / totalLandedCost) * 100).toFixed(1)), color: '#fb923c' }] : [])
  ];

  return {
    cargoQuantity,
    cargoType,
    origin,
    destination,
    vesselClass,
    contractType,
    distanceNM,
    sailingDays,
    waitingDays: effectiveWaitingDays,
    dischargeDays,
    totalVoyageDays,
    ratesUsed: {
      freightRatePerMT: effectiveFreightRate,
      fuelPricePerMT: effectiveFuelPrice,
      demurragePerDay: activeDemurrageRate
    },
    costs: {
      oceanFreightCost,
      bunkerCost,
      portTariffCost,
      handlingCost,
      lighteringCost,
      expectedDemurrageCost,
      totalLandedCost,
      costPerMT
    },
    breakdown: costBreakdown,
    sensitivityModifiers: {
      fuelPriceDeltaPct,
      freightRateDeltaPct,
      overrideWaitingDays
    },
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Total Landed Cost Engine',
    disclaimer: 'ILLUSTRATIVE SIMULATION'
  };
}

module.exports = {
  calculateTotalCost,
  getDistanceNM
};
