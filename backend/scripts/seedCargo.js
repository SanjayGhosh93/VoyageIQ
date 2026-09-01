const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fs = require('fs');
const readline = require('readline');
const { mysqlPool } = require('../config/mysql');

async function importCargoData() {
  const possiblePaths = [
    path.join(__dirname, '../Dataset_Cargo.csv'),
    path.join(__dirname, '../../Dataset_Cargo.csv'),
    path.join(process.cwd(), 'Dataset_Cargo.csv')
  ];

  const csvFilePath = possiblePaths.find(p => fs.existsSync(p));

  if (!csvFilePath) {
    console.error('Error: Dataset_Cargo.csv not found!');
    process.exit(1);
  }

  console.log(`[CSV Found] Reading from: ${csvFilePath}`);

  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;
  let insertedCount = 0;

  console.log('Starting MySQL import...');

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const row = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''));
    if (row.length < 10) continue;

    const query = `
      INSERT INTO cargo_dataset (
        year, item, dry_cargo_liner, dry_cargo_bulk_carrier,
        oil_tanker, passenger_cum_cargo, off_shore_supply,
        specialised_off_shore, timber_carrier, total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      parseInt(row[0]) || 0,
      row[1],
      parseFloat(row[2]) || 0,
      parseFloat(row[3]) || 0,
      parseFloat(row[4]) || 0,
      parseFloat(row[5]) || 0,
      parseFloat(row[6]) || 0,
      parseFloat(row[7]) || 0,
      parseFloat(row[8]) || 0,
      parseFloat(row[9]) || 0
    ];

    await mysqlPool.execute(query, values);
    insertedCount++;
  }

  console.log(`[Success] Imported ${insertedCount} rows into 'cargo_dataset'.`);
  process.exit(0);
}

importCargoData().catch(err => {
  console.error('Import failed:', err.message);
  process.exit(1);
});