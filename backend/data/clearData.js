// backend/data/clearData.js
// OceanCharter AI - Database Purge & Cleanup Script

require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const Alert = require('../models/Alert');
const Congestion = require('../models/Congestion');
const Forecast = require('../models/Forecast');
const FreightRate = require('../models/FreightRate');
const FuelPrice = require('../models/FuelPrice');
const MarketIndex = require('../models/MarketIndex');
const Port = require('../models/Port');
const Recommendation = require('../models/Recommendation');
const Report = require('../models/Report');
const Route = require('../models/Route');
const Scenario = require('../models/Scenario');
const User = require('../models/User');
const Vessel = require('../models/Vessel');
const Weather = require('../models/Weather');

const clearDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oceancharter';
  console.log(`[Database Purge] Connecting to MongoDB at ${uri}...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log(`[Database Purge] Connected to database: ${conn.connection.name}`);
    console.log('[Database Purge] Deleting all dummy & seeded data from collections...');

    const results = await Promise.all([
      User.deleteMany({}),
      Port.deleteMany({}),
      Vessel.deleteMany({}),
      FreightRate.deleteMany({}),
      Alert.deleteMany({}),
      Scenario.deleteMany({}),
      FuelPrice.deleteMany({}),
      Weather.deleteMany({}),
      Congestion.deleteMany({}),
      Forecast.deleteMany({}),
      MarketIndex.deleteMany({}),
      Recommendation.deleteMany({}),
      Report.deleteMany({}),
      Route.deleteMany({})
    ]);

    const collectionNames = [
      'Users',
      'Ports',
      'Vessels',
      'FreightRates',
      'Alerts',
      'Scenarios',
      'FuelPrices',
      'Weathers',
      'Congestions',
      'Forecasts',
      'MarketIndices',
      'Recommendations',
      'Reports',
      'Routes'
    ];

    let totalDeleted = 0;
    collectionNames.forEach((name, idx) => {
      const count = results[idx]?.deletedCount || 0;
      totalDeleted += count;
      console.log(`  ✓ ${name}: ${count} document(s) deleted.`);
    });

    console.log(`\n[Database Purge] Successfully deleted all dummy data (${totalDeleted} total documents removed).`);
    console.log('[Database Purge] The database is now clean.');

    await mongoose.connection.close();
    console.log('[Database Purge] Connection closed.');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`\n[Database Purge Error] Failed to purge database: ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  clearDatabase();
}

module.exports = { clearDatabase };
