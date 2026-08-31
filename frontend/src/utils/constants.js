// frontend/src/utils/constants.js

export const APP_CONFIG = {
  appName: 'OCEANCHARTER AI',
  tagline: 'Predict Freight. Match Vessels. Reduce Demurrage.',
  subtitle: 'AI-powered decision support for overseas bulk cargo procurement and vessel chartering to India’s East Coast.',
  problemId: 'SIH26006',
  organization: 'Ministry of Steel',
  department: 'Steel Authority of India Limited (SAIL)',
  theme: 'Smart Transportation & Logistics',
  disclaimer: 'Enterprise AI Decision Support System engineered for SAIL Overseas Bulk Cargo Procurement & Demurrage Minimization • SIH 2026'
};

export const ORIGIN_PORTS = [
  { value: 'Gladstone', label: 'Gladstone (Australia)', country: 'Australia' },
  { value: 'Newcastle', label: 'Newcastle (Australia)', country: 'Australia' },
  { value: 'Hay Point', label: 'Hay Point (Australia)', country: 'Australia' },
  { value: 'Banjarmasin', label: 'Banjarmasin (Indonesia)', country: 'Indonesia' },
  { value: 'Taboneo', label: 'Taboneo Anchorage (Indonesia)', country: 'Indonesia' },
  { value: 'Maputo', label: 'Maputo (Mozambique)', country: 'Mozambique' },
  { value: 'Beira', label: 'Beira (Mozambique)', country: 'Mozambique' },
  { value: 'Richards Bay', label: 'Richards Bay (South Africa)', country: 'South Africa' },
  { value: 'Baltimore', label: 'Baltimore (USA)', country: 'United States' },
  { value: 'Hampton Roads', label: 'Hampton Roads / Norfolk (USA)', country: 'United States' },
  { value: 'Vostochny', label: 'Vostochny Port (Russia)', country: 'Russia' },
  { value: 'Taman', label: 'Taman / Black Sea (Russia)', country: 'Russia' }
];

export const DESTINATION_PORTS = [
  { value: 'Paradip', label: 'Paradip Port (Odisha)', draft: '14.5m', loa: '260m' },
  { value: 'Haldia', label: 'Haldia Dock Complex (WB)', draft: '8.5m', loa: '230m' },
  { value: 'Dhamra', label: 'Dhamra Port (Odisha)', draft: '18.0m', loa: '310m' },
  { value: 'Visakhapatnam', label: 'Visakhapatnam Port (AP)', draft: '16.5m', loa: '300m' },
  { value: 'Gangavaram', label: 'Gangavaram Port (AP)', draft: '18.5m', loa: '315m' },
  { value: 'Gopalpur', label: 'Gopalpur Port (Odisha)', draft: '13.0m', loa: '230m' },
  { value: 'Chennai', label: 'Chennai Port (TN)', draft: '14.0m', loa: '260m' },
  { value: 'Kamarajar', label: 'Kamarajar Ennore (TN)', draft: '16.0m', loa: '290m' },
  { value: 'Sagar / Sandheads', label: 'Sagar / Sandheads Anchorage (WB)', draft: '18.0m', loa: '330m' }
];

export const VESSEL_CLASSES = [
  { value: 'HANDYSIZE', label: 'Handysize (15,000–35,000 MT)', draft: '8.0–10.0m', loa: '160–180m' },
  { value: 'SUPRAMAX', label: 'Supramax (50,000–60,000 MT)', draft: '11.0–12.5m', loa: '190–200m' },
  { value: 'PANAMAX', label: 'Panamax (65,000–80,000 MT)', draft: '12.5–14.5m', loa: '225–230m' },
  { value: 'CAPESIZE', label: 'Capesize (100,000–180,000 MT)', draft: '16.0–18.5m', loa: '280–290m' }
];

export const CARGO_TYPES = [
  'Coking Coal',
  'Thermal Coal',
  'Iron Ore Pellets',
  'Limestone',
  'Metallurgical Coke',
  'Manganese Ore',
  'Bauxite / Alumina'
];

export const CONTRACT_TYPES = ['Spot Voyage', 'Time Charter', 'COA'];

export const HORIZON_OPTIONS = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
  { value: 60, label: '60 Days' },
  { value: 90, label: '90 Days' }
];
