// backend/data/seedData.js
// OceanCharter AI - Comprehensive MongoDB Seeder & Mock Store Provider

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Port = require('../models/Port');
const Vessel = require('../models/Vessel');
const FreightRate = require('../models/FreightRate');
const Alert = require('../models/Alert');
const Scenario = require('../models/Scenario');
const FuelPrice = require('../models/FuelPrice');
const Weather = require('../models/Weather');
const Congestion = require('../models/Congestion');
const { generate730DaysData } = require('./syntheticFreightData');

const SEED_USERS = [
  {
    name: 'Sanjay Ghosh',
    email: 'admin@sail.gov.in',
    password: 'password123',
    role: 'Admin',
    organization: 'SAIL Corporate Logistics Directorate',
    department: 'Bulk Shipping & Strategic Chartering'
  },
  {
    name: 'Rajesh Mukherjee',
    email: 'procurement@sail.gov.in',
    password: 'password123',
    role: 'Procurement Manager',
    organization: 'SAIL Raw Materials Division (RMD)',
    department: 'Coking Coal Import Cell'
  },
  {
    name: 'Ananya Sharma',
    email: 'logistics@sail.gov.in',
    password: 'password123',
    role: 'Logistics Manager',
    organization: 'SAIL Transport & Shipping Dept',
    department: 'East Coast Port Operations'
  },
  {
    name: 'Amitabh Sen',
    email: 'analyst@sail.gov.in',
    password: 'password123',
    role: 'Analyst',
    organization: 'SAIL Central Marketing & Analytics',
    department: 'Freight Market Intelligence'
  },
  {
    name: 'Executive Guest',
    email: 'viewer@sail.gov.in',
    password: 'password123',
    role: 'Viewer',
    organization: 'Ministry of Steel / SAIL Observer',
    department: 'Executive Review Board'
  }
];

const SEED_PORTS = [
  // 9 Indian East Coast Ports
  {
    name: 'Haldia',
    code: 'INHAL',
    country: 'India',
    region: 'East Coast India',
    latitude: 22.025,
    longitude: 88.058,
    channelDraft: 8.5,
    berthDraft: 8.5,
    maxLOA: 230,
    maxBeam: 32.5,
    berths: 14,
    handlingRateTPH: 1400,
    queueLength: 6,
    averageWaitingDays: 4.8,
    tideDependent: true,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Limestone', 'General Cargo'],
    monsoonRisk: 'HIGH',
    railEvacuationCapacityTPD: 28000,
    dataQuality: 'VERIFIED',
    source: 'Syama Prasad Mookerjee Port Kolkata Tariffs 2026'
  },
  {
    name: 'Sagar / Sandheads',
    code: 'INSAG',
    country: 'India',
    region: 'East Coast India',
    latitude: 21.650,
    longitude: 88.010,
    channelDraft: 18.0,
    berthDraft: 18.0,
    maxLOA: 330,
    maxBeam: 50.0,
    berths: 6,
    handlingRateTPH: 2200,
    queueLength: 2,
    averageWaitingDays: 1.5,
    tideDependent: false,
    lighteringAvailable: true,
    transshipmentAvailable: true,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore'],
    monsoonRisk: 'HIGH',
    railEvacuationCapacityTPD: 0,
    dataQuality: 'VERIFIED',
    source: 'Kolkata Port Trust Offshore Anchorage Notice'
  },
  {
    name: 'Paradip',
    code: 'INPRT',
    country: 'India',
    region: 'East Coast India',
    latitude: 20.264,
    longitude: 86.669,
    channelDraft: 17.5,
    berthDraft: 14.5,
    maxLOA: 260,
    maxBeam: 45.0,
    berths: 16,
    handlingRateTPH: 2500,
    queueLength: 4,
    averageWaitingDays: 2.5,
    tideDependent: false,
    lighteringAvailable: true,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone', 'Manganese'],
    monsoonRisk: 'MODERATE',
    railEvacuationCapacityTPD: 65000,
    dataQuality: 'LIVE',
    source: 'Paradip Port Authority Daily Vessel Lineup'
  },
  {
    name: 'Dhamra',
    code: 'INDHR',
    country: 'India',
    region: 'East Coast India',
    latitude: 20.803,
    longitude: 86.963,
    channelDraft: 18.5,
    berthDraft: 18.0,
    maxLOA: 310,
    maxBeam: 48.0,
    berths: 5,
    handlingRateTPH: 3000,
    queueLength: 3,
    averageWaitingDays: 2.0,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone'],
    monsoonRisk: 'MODERATE',
    railEvacuationCapacityTPD: 55000,
    dataQuality: 'VERIFIED',
    source: 'Dhamra Port Company Ltd (DPCL) Operational Guide'
  },
  {
    name: 'Visakhapatnam',
    code: 'INVTZ',
    country: 'India',
    region: 'East Coast India',
    latitude: 17.686,
    longitude: 83.218,
    channelDraft: 18.1,
    berthDraft: 16.5,
    maxLOA: 300,
    maxBeam: 48.0,
    berths: 24,
    handlingRateTPH: 2800,
    queueLength: 3,
    averageWaitingDays: 1.8,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Alumina', 'Limestone'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 75000,
    dataQuality: 'LIVE',
    source: 'Visakhapatnam Port Trust Traffic Directory'
  },
  {
    name: 'Gangavaram',
    code: 'INGGV',
    country: 'India',
    region: 'East Coast India',
    latitude: 17.616,
    longitude: 83.238,
    channelDraft: 19.5,
    berthDraft: 18.5,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 9,
    handlingRateTPH: 3200,
    queueLength: 2,
    averageWaitingDays: 1.2,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Limestone', 'Bauxite'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 48000,
    dataQuality: 'VERIFIED',
    source: 'Gangavaram Port Marine Manual'
  },
  {
    name: 'Gopalpur',
    code: 'INGPL',
    country: 'India',
    region: 'East Coast India',
    latitude: 19.300,
    longitude: 84.960,
    channelDraft: 14.5,
    berthDraft: 13.0,
    maxLOA: 230,
    maxBeam: 33.0,
    berths: 4,
    handlingRateTPH: 1200,
    queueLength: 2,
    averageWaitingDays: 2.0,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Ilmenite', 'Limestone'],
    monsoonRisk: 'MODERATE',
    railEvacuationCapacityTPD: 22000,
    dataQuality: 'ESTIMATED',
    source: 'Gopalpur Ports Ltd Tariffs'
  },
  {
    name: 'Chennai',
    code: 'INMAA',
    country: 'India',
    region: 'East Coast India',
    latitude: 13.082,
    longitude: 80.298,
    channelDraft: 16.5,
    berthDraft: 14.0,
    maxLOA: 260,
    maxBeam: 42.0,
    berths: 18,
    handlingRateTPH: 1800,
    queueLength: 3,
    averageWaitingDays: 2.2,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Thermal Coal', 'Limestone', 'General Cargo', 'Fertilizer'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 35000,
    dataQuality: 'VERIFIED',
    source: 'Chennai Port Authority Marine Department'
  },
  {
    name: 'Kamarajar',
    code: 'INENR',
    country: 'India',
    region: 'East Coast India',
    latitude: 13.264,
    longitude: 80.334,
    channelDraft: 18.0,
    berthDraft: 16.0,
    maxLOA: 290,
    maxBeam: 45.0,
    berths: 8,
    handlingRateTPH: 2600,
    queueLength: 2,
    averageWaitingDays: 1.5,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Automobiles'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 42000,
    dataQuality: 'VERIFIED',
    source: 'Kamarajar Port Ltd Operational Guide'
  },

  // 8 Overseas Origin Ports
  {
    name: 'Gladstone',
    code: 'AUGLT',
    country: 'Australia',
    region: 'Australia',
    latitude: -23.843,
    longitude: 151.258,
    channelDraft: 19.5,
    berthDraft: 18.5,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 8,
    handlingRateTPH: 4500,
    queueLength: 4,
    averageWaitingDays: 2.1,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Alumina'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 120000,
    dataQuality: 'LIVE',
    source: 'Gladstone Ports Corporation'
  },
  {
    name: 'Newcastle',
    code: 'AUNTL',
    country: 'Australia',
    region: 'Australia',
    latitude: -32.928,
    longitude: 151.781,
    channelDraft: 17.5,
    berthDraft: 16.2,
    maxLOA: 300,
    maxBeam: 47.0,
    berths: 10,
    handlingRateTPH: 4000,
    queueLength: 5,
    averageWaitingDays: 2.8,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Thermal Coal', 'Coking Coal'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 150000,
    dataQuality: 'LIVE',
    source: 'Port of Newcastle Operations'
  },
  {
    name: 'Hay Point',
    code: 'AUHPT',
    country: 'Australia',
    region: 'Australia',
    latitude: -21.285,
    longitude: 149.301,
    channelDraft: 20.0,
    berthDraft: 19.0,
    maxLOA: 330,
    maxBeam: 55.0,
    berths: 6,
    handlingRateTPH: 5000,
    queueLength: 3,
    averageWaitingDays: 1.8,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Coking Coal', 'Thermal Coal'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 140000,
    dataQuality: 'LIVE',
    source: 'BHP Mitsubishi Alliance Terminal Guide'
  },
  {
    name: 'Banjarmasin',
    code: 'IDBDJ',
    country: 'Indonesia',
    region: 'Indonesia',
    latitude: -3.319,
    longitude: 114.590,
    channelDraft: 11.5,
    berthDraft: 10.5,
    maxLOA: 200,
    maxBeam: 32.0,
    berths: 4,
    handlingRateTPH: 1500,
    queueLength: 4,
    averageWaitingDays: 3.2,
    tideDependent: true,
    lighteringAvailable: true,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX'],
    cargoTypes: ['Thermal Coal'],
    monsoonRisk: 'MODERATE',
    railEvacuationCapacityTPD: 0,
    dataQuality: 'ESTIMATED',
    source: 'Pelindo Indonesia Port Guide'
  },
  {
    name: 'Taboneo',
    code: 'IDTAB',
    country: 'Indonesia',
    region: 'Indonesia',
    latitude: -3.720,
    longitude: 114.480,
    channelDraft: 16.0,
    berthDraft: 15.0,
    maxLOA: 250,
    maxBeam: 38.0,
    berths: 4,
    handlingRateTPH: 2200,
    queueLength: 3,
    averageWaitingDays: 2.0,
    tideDependent: false,
    lighteringAvailable: true,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Thermal Coal'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 0,
    dataQuality: 'SIMULATED',
    source: 'South Kalimantan Anchorage Directives'
  },
  {
    name: 'Maputo',
    code: 'MZMPM',
    country: 'Mozambique',
    region: 'South Africa',
    latitude: -25.969,
    longitude: 32.573,
    channelDraft: 14.5,
    berthDraft: 13.5,
    maxLOA: 240,
    maxBeam: 35.0,
    berths: 5,
    handlingRateTPH: 1800,
    queueLength: 3,
    averageWaitingDays: 2.5,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Thermal Coal', 'Coking Coal', 'Magnetite'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 30000,
    dataQuality: 'ESTIMATED',
    source: 'Maputo Port Development Company'
  },
  {
    name: 'Richards Bay',
    code: 'ZARCB',
    country: 'South Africa',
    region: 'South Africa',
    latitude: -28.800,
    longitude: 32.050,
    channelDraft: 19.5,
    berthDraft: 18.0,
    maxLOA: 315,
    maxBeam: 50.0,
    berths: 10,
    handlingRateTPH: 4200,
    queueLength: 4,
    averageWaitingDays: 2.4,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX', 'CAPESIZE'],
    cargoTypes: ['Thermal Coal', 'Coking Coal', 'Titanium'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 95000,
    dataQuality: 'LIVE',
    source: 'Transnet National Ports Authority'
  },
  {
    name: 'Baltimore',
    code: 'USBAL',
    country: 'United States',
    region: 'North America',
    latitude: 39.290,
    longitude: -76.612,
    channelDraft: 15.5,
    berthDraft: 14.5,
    maxLOA: 290,
    maxBeam: 44.0,
    berths: 6,
    handlingRateTPH: 2500,
    queueLength: 3,
    averageWaitingDays: 2.2,
    tideDependent: false,
    lighteringAvailable: false,
    transshipmentAvailable: false,
    compatibleVesselClasses: ['HANDYSIZE', 'SUPRAMAX', 'PANAMAX'],
    cargoTypes: ['Coking Coal', 'Thermal Coal', 'Metallurgical Coke'],
    monsoonRisk: 'LOW',
    railEvacuationCapacityTPD: 45000,
    dataQuality: 'VERIFIED',
    source: 'Maryland Port Administration'
  }
];

const SEED_VESSELS = [
  {
    name: 'MV Ocean Pioneer',
    imoNumber: 'IMO9745120',
    vesselClass: 'CAPESIZE',
    dwt: 180000,
    draft: 17.5,
    loa: 285,
    beam: 45.0,
    serviceSpeedKnots: 14.0,
    fuelConsumptionAtSeaTPD: 48,
    fuelConsumptionInPortTPD: 5.5,
    demurrageRatePerDayUSD: 30000,
    dailyHireRateUSD: 36000,
    flag: 'Panama',
    status: 'AVAILABLE',
    currentLocation: { port: 'Gladstone', latitude: -23.843, longitude: 151.258 }
  },
  {
    name: 'MV Bharat Enterprise',
    imoNumber: 'IMO9688412',
    vesselClass: 'PANAMAX',
    dwt: 75000,
    draft: 13.5,
    loa: 228,
    beam: 32.3,
    serviceSpeedKnots: 13.5,
    fuelConsumptionAtSeaTPD: 32,
    fuelConsumptionInPortTPD: 4.0,
    demurrageRatePerDayUSD: 20000,
    dailyHireRateUSD: 23000,
    flag: 'India',
    status: 'AVAILABLE',
    currentLocation: { port: 'Gladstone', latitude: -23.843, longitude: 151.258 }
  },
  {
    name: 'MV Steel Voyager',
    imoNumber: 'IMO9541209',
    vesselClass: 'SUPRAMAX',
    dwt: 58000,
    draft: 11.8,
    loa: 195,
    beam: 32.2,
    serviceSpeedKnots: 13.5,
    fuelConsumptionAtSeaTPD: 26,
    fuelConsumptionInPortTPD: 3.5,
    demurrageRatePerDayUSD: 16000,
    dailyHireRateUSD: 18500,
    flag: 'Liberia',
    status: 'AVAILABLE',
    currentLocation: { port: 'Banjarmasin', latitude: -3.319, longitude: 114.590 }
  },
  {
    name: 'MV Bengal Carrier',
    imoNumber: 'IMO9432118',
    vesselClass: 'HANDYSIZE',
    dwt: 32000,
    draft: 9.5,
    loa: 170,
    beam: 27.0,
    serviceSpeedKnots: 13.0,
    fuelConsumptionAtSeaTPD: 18,
    fuelConsumptionInPortTPD: 3.0,
    demurrageRatePerDayUSD: 12000,
    dailyHireRateUSD: 14000,
    flag: 'Marshall Islands',
    status: 'AVAILABLE',
    currentLocation: { port: 'Haldia', latitude: 22.025, longitude: 88.058 }
  }
];

const SEED_ALERTS = [
  {
    title: 'Bullish Freight Rate Momentum Detected',
    message: 'Baltic Panamax Index (BPI) 20-day EMA ($18.42) has widened +8.2% above 50-day EMA ($17.02) on Australia-India East Coast coking coal routes.',
    category: 'Freight',
    severity: 'HIGH',
    affectedRoute: 'Gladstone → Paradip / Haldia',
    affectedVesselClass: 'PANAMAX',
    recommendation: 'Fix forward requirements via 3-month Time Charter or index-linked COA to lock in lower baseline before rates test $21.50/MT.',
    actionableLink: '/forecast'
  },
  {
    title: 'Draft & Tidal Gating Restriction Warning',
    message: 'Syama Prasad Mookerjee Port (Haldia) reports maximum permissible draft capped at 8.5m due to Hooghly river siltation.',
    category: 'Port',
    severity: 'CRITICAL',
    affectedPort: 'Haldia',
    affectedVesselClass: 'CAPESIZE',
    recommendation: 'Do NOT fixture direct Capesize or Panamax voyages to Haldia. Utilize Sagar/Sandheads lightering or discharge directly at Paradip / Dhamra.',
    actionableLink: '/vessel-matcher'
  },
  {
    title: 'Monsoon High Swell Advisory - Northern Bay of Bengal',
    message: 'India Meteorological Department (IMD) predicts wave heights of 3.8m and squally winds at Paradip & Gopalpur anchorages over the next 72 hours.',
    category: 'Weather',
    severity: 'MEDIUM',
    affectedPort: 'Paradip',
    recommendation: 'Factor in +24 to 48 hours buffer laytime in charter party terms to protect against demurrage claims.',
    actionableLink: '/risk'
  },
  {
    title: 'Bunker VLSFO Price Escalation in Singapore Hub',
    message: 'Very Low Sulfur Fuel Oil (VLSFO) prices in Singapore climbed +6.4% to $648/MT due to crude refining margins and tanker freight.',
    category: 'Fuel',
    severity: 'MEDIUM',
    affectedRoute: 'Australia → East Coast India',
    recommendation: 'Evaluate eco-speed sailing mode (12 knots vs 14 knots) to save approximately $18,200 in voyage fuel burn.',
    actionableLink: '/calculator'
  },
  {
    title: 'Mechanised Coal Berth Queue Congestion',
    message: 'Dhamra Port reports 3 Capesize vessels in queue for 2 mechanized berths with average waiting duration of 48 hours.',
    category: 'Congestion',
    severity: 'LOW',
    affectedPort: 'Dhamra',
    recommendation: 'Pre-advise railway rake indenting to maintain continuous discharge evacuation rate.',
    actionableLink: '/idle'
  }
];

const SEED_SCENARIOS = [
  {
    title: 'Baseline SIH Demo: Gladstone to Haldia 120k MT (Capesize)',
    description: 'Direct voyage attempt for SAIL Durgapur & IISCO steel plants with heavy parcel.',
    cargoType: 'Coking Coal',
    cargoQuantityMT: 120000,
    originPort: 'Gladstone',
    destinationPort: 'Haldia',
    vesselClass: 'CAPESIZE',
    contractType: 'Spot Voyage',
    isFeasible: false,
    feasibilityStatus: 'INFEASIBLE',
    failedConstraints: [
      'DRAFT INCOMPATIBILITY: Vessel loaded draft (17.5m) exceeds Haldia maximum permissible berth draft (8.5m) by 9.0m.',
      'LOA INCOMPATIBILITY: Vessel Length Overall (285m) exceeds Haldia maximum permissible LOA (230m).'
    ],
    warnings: ['Severe Hooghly River navigational draft restrictions active'],
    compatibilityScore: 20,
    riskScore: 84,
    freightRateUSDPerMT: 14.80,
    oceanFreightCostUSD: 1776000,
    bunkerCostUSD: 462000,
    portTariffCostUSD: 118000,
    handlingCostUSD: 384000,
    demurrageExposureUSD: 120000,
    totalLandedCostUSD: 2860000,
    costPerMT: 23.83,
    transitDays: 15.6,
    waitingDays: 4.8,
    dischargeDays: 3.5,
    totalVoyageDays: 23.9,
    optimizationScore: 25,
    tag: 'INFEASIBLE',
    recommendedAction: 'Reroute to Paradip Port or execute Sandheads offshore lightering.'
  },
  {
    title: 'Optimized Option 1: Gladstone to Paradip 70k MT (Panamax)',
    description: 'Recommended direct discharge route with high compatibility and lowest demurrage exposure.',
    cargoType: 'Coking Coal',
    cargoQuantityMT: 70000,
    originPort: 'Gladstone',
    destinationPort: 'Paradip',
    vesselClass: 'PANAMAX',
    contractType: 'Time Charter',
    isFeasible: true,
    feasibilityStatus: 'FEASIBLE',
    failedConstraints: [],
    warnings: ['Draft clearance margin 1.0m is adequate; monitor high tide arrival'],
    compatibilityScore: 92,
    riskScore: 24,
    freightRateUSDPerMT: 18.42,
    oceanFreightCostUSD: 1289400,
    bunkerCostUSD: 310000,
    portTariffCostUSD: 78000,
    handlingCostUSD: 224000,
    demurrageExposureUSD: 10000,
    totalLandedCostUSD: 1911400,
    costPerMT: 27.31,
    transitDays: 15.7,
    waitingDays: 2.5,
    dischargeDays: 1.9,
    totalVoyageDays: 20.1,
    optimizationScore: 92,
    tag: 'BEST_VALUE',
    recommendedAction: 'Execute Time Charter fixture. Coordinate ECoR railway rakes for direct dispatch to Rourkela/Bhilai.'
  },
  {
    title: 'Alternative Option 2: Gladstone to Dhamra 120k MT (Capesize)',
    description: 'Direct deep-water discharge utilizing Dhamra 18m draught bulk terminal.',
    cargoType: 'Coking Coal',
    cargoQuantityMT: 120000,
    originPort: 'Gladstone',
    destinationPort: 'Dhamra',
    vesselClass: 'CAPESIZE',
    contractType: 'Spot Voyage',
    isFeasible: true,
    feasibilityStatus: 'FEASIBLE',
    failedConstraints: [],
    warnings: ['Check mechanized conveyor queue on arrival'],
    compatibilityScore: 88,
    riskScore: 31,
    freightRateUSDPerMT: 14.80,
    oceanFreightCostUSD: 1776000,
    bunkerCostUSD: 456000,
    portTariffCostUSD: 118000,
    handlingCostUSD: 384000,
    demurrageExposureUSD: 30000,
    totalLandedCostUSD: 2764000,
    costPerMT: 23.03,
    transitDays: 15.4,
    waitingDays: 2.0,
    dischargeDays: 2.2,
    totalVoyageDays: 19.6,
    optimizationScore: 89,
    tag: 'ALTERNATIVE',
    recommendedAction: 'Discharge full Capesize parcel at Dhamra; evacuate via SER railway link.'
  },
  {
    title: 'Transshipment Option 3: Gladstone to Sagar / Sandheads (Lightering)',
    description: 'Offshore deep water anchor lightering into daughter barges to supply Haldia dock.',
    cargoType: 'Coking Coal',
    cargoQuantityMT: 120000,
    originPort: 'Gladstone',
    destinationPort: 'Sagar / Sandheads',
    vesselClass: 'CAPESIZE',
    contractType: 'Spot Voyage',
    isFeasible: true,
    feasibilityStatus: 'CONDITIONAL',
    failedConstraints: [],
    warnings: ['Lightering operations subject to sea-swell < 2.0m'],
    compatibilityScore: 78,
    riskScore: 48,
    freightRateUSDPerMT: 14.80,
    oceanFreightCostUSD: 1776000,
    bunkerCostUSD: 460000,
    portTariffCostUSD: 95000,
    handlingCostUSD: 384000,
    lighteringCostUSD: 375000,
    demurrageExposureUSD: 45000,
    totalLandedCostUSD: 3135000,
    costPerMT: 26.13,
    transitDays: 15.5,
    waitingDays: 1.5,
    dischargeDays: 4.5,
    totalVoyageDays: 21.5,
    optimizationScore: 74,
    tag: 'ALTERNATIVE',
    recommendedAction: 'Deploy offshore floating crane at Sandheads; transfer 50k MT to barges.'
  }
];

async function seedDatabase() {
  console.log('[Seed] Starting OceanCharter AI database seeding...');
  
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oceancharter';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log('[Seed] Connected to MongoDB for seeding.');

    // Clear existing collections
    await User.deleteMany({});
    await Port.deleteMany({});
    await Vessel.deleteMany({});
    await FreightRate.deleteMany({});
    await Alert.deleteMany({});
    await Scenario.deleteMany({});
    await FuelPrice.deleteMany({});
    await Weather.deleteMany({});
    await Congestion.deleteMany({});

    // Seed Users
    for (const u of SEED_USERS) {
      await User.create(u);
    }
    console.log(`[Seed] Seeded ${SEED_USERS.length} authenticated enterprise users (Admin, Managers, Analyst, Viewer).`);

    // Seed Ports
    await Port.insertMany(SEED_PORTS);
    console.log(`[Seed] Seeded ${SEED_PORTS.length} ports (9 East Coast India + 8 Overseas origins).`);

    // Seed Vessels
    await Vessel.insertMany(SEED_VESSELS);
    console.log(`[Seed] Seeded ${SEED_VESSELS.length} demo vessel fleet profiles.`);

    // Seed Alerts
    await Alert.insertMany(SEED_ALERTS);
    console.log(`[Seed] Seeded ${SEED_ALERTS.length} early warning alerts.`);

    // Seed Scenarios
    await Scenario.insertMany(SEED_SCENARIOS);
    console.log(`[Seed] Seeded ${SEED_SCENARIOS.length} benchmark chartering scenarios.`);

    // Seed 730 days synthetic freight data
    const syntheticData = generate730DaysData();
    await FreightRate.insertMany(syntheticData);
    console.log(`[Seed] Seeded ${syntheticData.length} records of 730-day historical/synthetic freight time-series.`);

    console.log('[Seed] Database seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.warn(`[Seed Warning] Could not connect to local MongoDB (${error.message}).`);
    console.log(`[Seed Notice] OceanCharter AI backend will serve seeded in-memory fallback datasets automatically.`);
    if (require.main === module) {
      process.exit(0);
    }
  }
}

// In-Memory Fallback Store (for instant out-of-the-box operation even if MongoDB is not running locally)
const inMemoryStore = {
  users: [...SEED_USERS],
  ports: [...SEED_PORTS],
  vessels: [...SEED_VESSELS],
  alerts: [...SEED_ALERTS],
  scenarios: [...SEED_SCENARIOS],
  syntheticFreightData: generate730DaysData()
};

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  inMemoryStore,
  SEED_USERS,
  SEED_PORTS,
  SEED_VESSELS,
  SEED_ALERTS,
  SEED_SCENARIOS
};
