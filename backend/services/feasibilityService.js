// backend/services/feasibilityService.js
// OceanCharter AI - Deterministic Maritime Feasibility Engine

// Port operational constraint specifications
const PORT_SPECS = {
  Haldia: {
    channelDraft: 8.5,
    berthDraft: 8.5,
    maxLOA: 230,
    maxBeam: 32.5,
    berths: 14,
    queueLength: 6,
    avgWaitingDays: 4.8,
    tideDependent: true,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Limestone', 'General Cargo'],
    monsoonRisk: 'HIGH',
    handlingRateTPH: 950
  },
  'Sagar / Sandheads': {
    channelDraft: 18.0,
    berthDraft: 18.0,
    maxLOA: 330,
    maxBeam: 50.0,
    berths: 6, // Offshore anchorage points
    queueLength: 2,
    avgWaitingDays: 1.5,
    tideDependent: false,
    lighteringAvailable: true,
    transshipmentAvailable: true,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore'],
    monsoonRisk: 'HIGH',
    handlingRateTPH: 1400
  },
  Paradip: {
    channelDraft: 17.5,
    berthDraft: 14.5,
    maxLOA: 260,
    maxBeam: 45.0,
    berths: 16,
    queueLength: 4,
    avgWaitingDays: 2.5,
    tideDependent: false,
    lighteringAvailable: true,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone', 'Manganese'],
    monsoonRisk: 'MODERATE',
    handlingRateTPH: 1800
  },
  Dhamra: {
    channelDraft: 18.5,
    berthDraft: 18.0,
    maxLOA: 310,
    maxBeam: 48.0,
    berths: 5,
    queueLength: 3,
    avgWaitingDays: 2.0,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone'],
    monsoonRisk: 'MODERATE',
    handlingRateTPH: 2200
  },
  Visakhapatnam: {
    channelDraft: 18.1,
    berthDraft: 16.5,
    maxLOA: 300,
    maxBeam: 48.0,
    berths: 24,
    queueLength: 3,
    avgWaitingDays: 1.8,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Alumina', 'Limestone'],
    monsoonRisk: 'LOW',
    handlingRateTPH: 1600
  },
  Gangavaram: {
    channelDraft: 19.5,
    berthDraft: 18.5,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 9,
    queueLength: 2,
    avgWaitingDays: 1.2,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone', 'Bauxite'],
    monsoonRisk: 'LOW',
    handlingRateTPH: 2000
  },
  Gopalpur: {
    channelDraft: 14.5,
    berthDraft: 13.0,
    maxLOA: 230,
    maxBeam: 33.0,
    berths: 4,
    queueLength: 2,
    avgWaitingDays: 2.0,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Ilmenite', 'Limestone'],
    monsoonRisk: 'MODERATE',
    handlingRateTPH: 1100
  },
  Chennai: {
    channelDraft: 16.5,
    berthDraft: 14.0,
    maxLOA: 260,
    maxBeam: 42.0,
    berths: 18,
    queueLength: 3,
    avgWaitingDays: 2.2,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Thermal Coal', 'Limestone', 'General Cargo', 'Fertilizer'],
    monsoonRisk: 'LOW',
    handlingRateTPH: 1200
  },
  Kamarajar: {
    channelDraft: 18.0,
    berthDraft: 16.0,
    maxLOA: 290,
    maxBeam: 45.0,
    berths: 8,
    queueLength: 2,
    avgWaitingDays: 1.5,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Automobiles'],
    monsoonRisk: 'LOW',
    handlingRateTPH: 1750
  },
  // Overseas Origin Ports
  Gladstone: {
    channelDraft: 19.5,
    berthDraft: 18.5,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 8,
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Alumina'],
    monsoonRisk: 'LOW'
  },
  Newcastle: {
    channelDraft: 17.5,
    berthDraft: 16.2,
    maxLOA: 300,
    maxBeam: 47.0,
    berths: 10,
    cargoTypes: ['Thermal Coal', 'Coking Coal'],
    monsoonRisk: 'LOW'
  },
  'Hay Point': {
    channelDraft: 20.0,
    berthDraft: 19.0,
    maxLOA: 330,
    maxBeam: 55.0,
    berths: 6,
    cargoTypes: ['Coking Coal', 'Thermal Coal'],
    monsoonRisk: 'LOW'
  },
  Banjarmasin: {
    channelDraft: 11.5,
    berthDraft: 10.5,
    maxLOA: 200,
    maxBeam: 32.0,
    berths: 4,
    cargoTypes: ['Thermal Coal'],
    monsoonRisk: 'MODERATE'
  },
  Taboneo: {
    channelDraft: 16.0,
    berthDraft: 15.0,
    maxLOA: 250,
    maxBeam: 38.0,
    berths: 4,
    cargoTypes: ['Thermal Coal'],
    monsoonRisk: 'LOW'
  },
  Maputo: {
    channelDraft: 14.5,
    berthDraft: 13.5,
    maxLOA: 240,
    maxBeam: 35.0,
    berths: 5,
    cargoTypes: ['Thermal Coal', 'Coking Coal', 'Magnetite'],
    monsoonRisk: 'LOW'
  },
  'Richards Bay': {
    channelDraft: 19.5,
    berthDraft: 18.0,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 10,
    cargoTypes: ['Thermal Coal', 'Coking Coal', 'Titanium'],
    monsoonRisk: 'LOW'
  },
  Baltimore: {
    channelDraft: 15.5,
    berthDraft: 14.5,
    maxLOA: 290,
    maxBeam: 44.0,
    berths: 6,
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Metallurgical Coke'],
    monsoonRisk: 'LOW'
  },
  'Hampton Roads': {
    channelDraft: 16.5,
    berthDraft: 15.5,
    maxLOA: 300,
    maxBeam: 46.0,
    berths: 8,
    cargoTypes: ['Coking Coal', 'Thermal Coal'],
    monsoonRisk: 'LOW'
  },
  Beira: {
    channelDraft: 10.5,
    berthDraft: 9.5,
    maxLOA: 200,
    maxBeam: 30.0,
    berths: 4,
    cargoTypes: ['Coking Coal', 'Thermal Coal'],
    monsoonRisk: 'LOW'
  },
  Vostochny: {
    channelDraft: 17.5,
    berthDraft: 16.5,
    maxLOA: 300,
    maxBeam: 45.0,
    berths: 6,
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'PCI Coal'],
    monsoonRisk: 'LOW'
  },
  Taman: {
    channelDraft: 19.5,
    berthDraft: 18.5,
    maxLOA: 315,
    maxBeam: 48.0,
    berths: 4,
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Metallurgical Coke'],
    monsoonRisk: 'LOW'
  }
};

// Vessel Classes Standard Specs
const VESSEL_SPECS = {
  HANDYSIZE: { minDWT: 15000, maxDWT: 35000, avgDWT: 28000, draft: 9.5, loa: 170, beam: 27, fuelSeaTPD: 18, demurragePerDay: 12000, hirePerDay: 14000 },
  SUPRAMAX: { minDWT: 50000, maxDWT: 60000, avgDWT: 56000, draft: 11.8, loa: 195, beam: 32.2, fuelSeaTPD: 26, demurragePerDay: 16000, hirePerDay: 18500 },
  PANAMAX: { minDWT: 65000, maxDWT: 80000, avgDWT: 74000, draft: 13.5, loa: 228, beam: 32.3, fuelSeaTPD: 32, demurragePerDay: 20000, hirePerDay: 23000 },
  CAPESIZE: { minDWT: 100000, maxDWT: 180000, avgDWT: 150000, draft: 17.5, loa: 285, beam: 45.0, fuelSeaTPD: 48, demurragePerDay: 30000, hirePerDay: 36000 }
};

/**
 * Check Feasibility of Voyage
 */
function checkFeasibility({
  cargoQuantity = 70000,
  cargoType = 'Coking Coal',
  origin = 'Gladstone',
  destination = 'Paradip',
  vesselClass = 'PANAMAX',
  weatherCondition = 'NORMAL',
  tidalAllowance = 0.5
}) {
  const destSpec = PORT_SPECS[destination] || PORT_SPECS['Paradip'];
  const originSpec = PORT_SPECS[origin] || PORT_SPECS['Gladstone'];
  const vessel = VESSEL_SPECS[vesselClass] || VESSEL_SPECS['PANAMAX'];

  const failedConstraints = [];
  const warnings = [];
  const details = {};
  const REQUIRED_UKC = 1.2; // Under Keel Clearance standard in meters

  // 1. CARGO CAPACITY CHECK (Case A)
  const maxSafeCargo = vessel.maxDWT * 0.96;
  const minSafeCargo = vessel.minDWT * 0.70;
  if (cargoQuantity > maxSafeCargo) {
    failedConstraints.push(`CARGO CAPACITY FAILURE: Cargo parcel (${cargoQuantity.toLocaleString()} MT) exceeds maximum deadweight capacity of ${vesselClass} (${maxSafeCargo.toLocaleString()} MT).`);
    details.cargoCapacity = { pass: false, message: `Exceeds max vessel payload ${maxSafeCargo.toLocaleString()} MT` };
  } else if (cargoQuantity < minSafeCargo) {
    warnings.push(`CARGO UNDERUTILIZATION: Cargo parcel (${cargoQuantity.toLocaleString()} MT) significantly under-utilizes ${vesselClass} capacity (${vessel.minDWT.toLocaleString()} MT minimum). High freight cost per MT.`);
    details.cargoCapacity = { pass: true, message: `Feasible but under-utilized` };
  } else {
    details.cargoCapacity = { pass: true, message: `${cargoQuantity.toLocaleString()} MT fits within ${vessel.minDWT.toLocaleString()}–${vessel.maxDWT.toLocaleString()} MT range` };
  }

  // 2. DESTINATION DRAFT & UKC CHECK (Case B & Case I)
  const effectivePortDraft = destSpec.berthDraft + (destSpec.tideDependent ? tidalAllowance : 0);
  const requiredWaterDepth = vessel.draft + REQUIRED_UKC;
  const draftMargin = Number((effectivePortDraft - vessel.draft).toFixed(2));

  if (vessel.draft > destSpec.berthDraft) {
    failedConstraints.push(`DRAFT INCOMPATIBILITY: Vessel loaded draft (${vessel.draft}m) exceeds destination berth draft (${destSpec.berthDraft}m) at ${destination} by ${(vessel.draft - destSpec.berthDraft).toFixed(1)}m.`);
    details.draft = { pass: false, vesselDraft: vessel.draft, portDraft: destSpec.berthDraft, margin: draftMargin };
  } else if (effectivePortDraft < requiredWaterDepth && draftMargin < 0.6) {
    warnings.push(`TIGHT DRAFT MARGIN: Berth draft ${effectivePortDraft}m provides Under Keel Clearance of ${draftMargin}m (standard recommendation: ${REQUIRED_UKC}m). Safe with pilot escort & high tide window.`);
    details.draft = { pass: true, vesselDraft: vessel.draft, portDraft: destSpec.berthDraft, margin: draftMargin };
  } else {
    details.draft = { pass: true, vesselDraft: vessel.draft, portDraft: destSpec.berthDraft, margin: draftMargin };
  }

  // 3. LOA CHECK (Case C)
  if (vessel.loa > destSpec.maxLOA) {
    failedConstraints.push(`LOA INCOMPATIBILITY: Vessel Length Overall (${vessel.loa}m) exceeds ${destination} maximum permissible LOA (${destSpec.maxLOA}m).`);
    details.loa = { pass: false, vesselLOA: vessel.loa, portMaxLOA: destSpec.maxLOA };
  } else {
    details.loa = { pass: true, vesselLOA: vessel.loa, portMaxLOA: destSpec.maxLOA };
  }

  // 4. BEAM CHECK (Case D)
  if (vessel.beam > destSpec.maxBeam) {
    failedConstraints.push(`BEAM INCOMPATIBILITY: Vessel beam (${vessel.beam}m) exceeds ${destination} channel/berth crane outreach limit (${destSpec.maxBeam}m).`);
    details.beam = { pass: false, vesselBeam: vessel.beam, portMaxBeam: destSpec.maxBeam };
  } else {
    details.beam = { pass: true, vesselBeam: vessel.beam, portMaxBeam: destSpec.maxBeam };
  }

  // 5. CARGO HANDLING COMPATIBILITY (Case G)
  if (destSpec.cargoTypes && !destSpec.cargoTypes.includes(cargoType)) {
    failedConstraints.push(`CARGO HANDLING INCOMPATIBILITY: ${destination} does not operate specialized discharge berths for ${cargoType}.`);
    details.cargoHandling = { pass: false, handledCargoes: destSpec.cargoTypes };
  } else {
    details.cargoHandling = { pass: true, handledCargoes: destSpec.cargoTypes };
  }

  // 6. ORIGIN PORT RESTRICTION (Case H)
  if (originSpec.berthDraft < vessel.draft) {
    failedConstraints.push(`ORIGIN PORT INCOMPATIBILITY: Origin port ${origin} berth draft (${originSpec.berthDraft}m) cannot accommodate loaded vessel draft (${vessel.draft}m).`);
    details.originCompatibility = { pass: false };
  } else {
    details.originCompatibility = { pass: true };
  }

  // 7. BERTH AVAILABILITY & CONGESTION (Case E)
  if (destSpec.queueLength >= destSpec.berths * 1.5) {
    warnings.push(`SEVERE PORT CONGESTION: ${destSpec.queueLength} vessels waiting for ${destSpec.berths} berths at ${destination}. Expected delay: ${destSpec.avgWaitingDays} days.`);
  }

  // 8. WEATHER & MONSOON RESTRICTIONS (Case F)
  if (weatherCondition === 'CYCLONE_WARNING' || (destSpec.monsoonRisk === 'SEVERE')) {
    failedConstraints.push(`WEATHER RESTRICTION: Severe cyclone/monsoon advisory active at ${destination}. Port authority has suspended pilotage and berthing operations.`);
    details.weather = { pass: false };
  } else if (destSpec.monsoonRisk === 'HIGH') {
    warnings.push(`MONSOON ADVISORY: High swell and rain delays expected at ${destination}. Discharge rate derated by 20%.`);
    details.weather = { pass: true, note: 'Monsoon active' };
  } else {
    details.weather = { pass: true, note: 'Normal weather' };
  }

  // Feasibility status evaluation
  const isFeasible = failedConstraints.length === 0;
  let feasibilityStatus = 'FEASIBLE';
  if (!isFeasible) {
    feasibilityStatus = 'INFEASIBLE';
  } else if (warnings.length > 0) {
    feasibilityStatus = 'CONDITIONAL';
  }

  // Compatibility Score (0 - 100)
  let compatibilityScore = 100;
  if (!isFeasible) {
    compatibilityScore = Math.max(10, 100 - (failedConstraints.length * 35));
  } else {
    compatibilityScore = Math.max(50, 100 - (warnings.length * 12));
  }

  return {
    origin,
    destination,
    vesselClass,
    cargoType,
    cargoQuantity,
    isFeasible,
    feasibilityStatus,
    failedConstraints,
    warnings,
    compatibilityScore,
    details,
    portSpecs: destSpec,
    vesselSpecs: vessel,
    headline: isFeasible ? 'VOYAGE FEASIBLE & COMPLIANT' : 'DIRECT VOYAGE NOT FEASIBLE',
    dataQuality: 'SIMULATED',
    source: 'OceanCharter AI Maritime Feasibility Engine'
  };
}

module.exports = {
  checkFeasibility,
  PORT_SPECS,
  VESSEL_SPECS
};
