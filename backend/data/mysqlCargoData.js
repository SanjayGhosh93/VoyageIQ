// backend/data/mysqlCargoData.js
const fs = require('fs');
const path = require('path');

// Route-level modern cargo procurement data from joy branch
const JOY_BRANCH_RECORDS = [
  {
    id: 106,
    year: 2026,
    item: 'Coking Coal (Gladstone → Paradip)',
    cargo_type: 'Coking Coal',
    origin_port: 'Gladstone',
    destination_port: 'Paradip',
    avg_freight_usd: 19.20,
    volume_mt: 17500000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 17500000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 17500000,
    source: 'Joy Branch MySQL Dataset: Coking Coal Strategic Corridor'
  },
  {
    id: 107,
    year: 2025,
    item: 'Coking Coal (Newcastle → Paradip)',
    cargo_type: 'Coking Coal',
    origin_port: 'Newcastle',
    destination_port: 'Paradip',
    avg_freight_usd: 18.75,
    volume_mt: 16800000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 16800000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 16800000,
    source: 'Joy Branch MySQL Dataset: Coking Coal Strategic Corridor'
  },
  {
    id: 108,
    year: 2024,
    item: 'Thermal Coal (Banjarmasin → Haldia)',
    cargo_type: 'Thermal Coal',
    origin_port: 'Banjarmasin',
    destination_port: 'Haldia',
    avg_freight_usd: 12.90,
    volume_mt: 11300000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 11300000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 11300000,
    source: 'Joy Branch MySQL Dataset: Thermal Coal Corridor'
  },
  {
    id: 109,
    year: 2023,
    item: 'Iron Ore (Port Hedland → Visakhapatnam)',
    cargo_type: 'Iron Ore',
    origin_port: 'Port Hedland',
    destination_port: 'Visakhapatnam',
    avg_freight_usd: 14.10,
    volume_mt: 8900000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 8900000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 8900000,
    source: 'Joy Branch MySQL Dataset: Iron Ore Corridor'
  },
  {
    id: 110,
    year: 2022,
    item: 'Coking Coal (Gladstone → Paradip)',
    cargo_type: 'Coking Coal',
    origin_port: 'Gladstone',
    destination_port: 'Paradip',
    avg_freight_usd: 22.80,
    volume_mt: 15200000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 15200000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 15200000,
    source: 'Joy Branch MySQL Dataset: Coking Coal Strategic Corridor'
  },
  {
    id: 111,
    year: 2021,
    item: 'Coking Coal (Gladstone → Paradip)',
    cargo_type: 'Coking Coal',
    origin_port: 'Gladstone',
    destination_port: 'Paradip',
    avg_freight_usd: 16.50,
    volume_mt: 14500000,
    dry_cargo_liner: 0,
    dry_cargo_bulk_carrier: 14500000,
    oil_tanker: 0,
    passenger_cum_cargo: 0,
    off_shore_supply: 0,
    specialised_off_shore: 0,
    timber_carrier: 0,
    total: 14500000,
    source: 'Joy Branch MySQL Dataset: Coking Coal Strategic Corridor'
  }
];

let cachedDataset = null;

function loadFullMySQLDataset() {
  if (cachedDataset && cachedDataset.length > 0) {
    return cachedDataset;
  }

  const possiblePaths = [
    path.join(__dirname, '../../Dataset_Cargo.csv'),
    path.join(__dirname, '../Dataset_Cargo.csv'),
    path.join(process.cwd(), 'Dataset_Cargo.csv')
  ];

  const csvPath = possiblePaths.find(p => fs.existsSync(p));

  const rows = [];
  let idCounter = 1;

  if (csvPath) {
    try {
      const raw = fs.readFileSync(csvPath, 'utf8');
      const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (parts.length < 10) continue;

        const year = parseInt(parts[0], 10);
        if (isNaN(year)) continue;

        const item = parts[1] || 'No. of Vessels';
        const dry_cargo_liner = parseFloat(parts[2]) || 0;
        const dry_cargo_bulk_carrier = parseFloat(parts[3]) || 0;
        const oil_tanker = parseFloat(parts[4]) || 0;
        const passenger_cum_cargo = parseFloat(parts[5]) || 0;
        const off_shore_supply = parseFloat(parts[6]) || 0;
        const specialised_off_shore = parseFloat(parts[7]) || 0;
        const timber_carrier = parseFloat(parts[8]) || 0;
        const total = parseFloat(parts[9]) || (dry_cargo_liner + dry_cargo_bulk_carrier + oil_tanker + passenger_cum_cargo + off_shore_supply + specialised_off_shore + timber_carrier);

        rows.push({
          id: idCounter++,
          year,
          item,
          dry_cargo_liner,
          dry_cargo_bulk_carrier,
          oil_tanker,
          passenger_cum_cargo,
          off_shore_supply,
          specialised_off_shore,
          timber_carrier,
          total: Math.round(total * 100) / 100,
          origin_port: 'East Coast Ports',
          destination_port: 'SAIL Steel Plants',
          avg_freight_usd: 18.50,
          source: 'MySQL Database: cargo_dataset (Dataset_Cargo.csv)'
        });
      }
    } catch (err) {
      console.error('[MySQL Data Error] Failed to read CSV:', err.message);
    }
  }

  // Combine CSV dataset + Joy branch records
  const unified = [...JOY_BRANCH_RECORDS, ...rows];
  unified.sort((a, b) => b.year - a.year || b.id - a.id);
  cachedDataset = unified;
  return cachedDataset;
}

module.exports = {
  loadFullMySQLDataset,
  JOY_BRANCH_RECORDS
};
