const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://sanjayghosh7120_db_user:qqUXOWD2A5q6lGf2@newone.ornd32t.mongodb.net/oceancharter?retryWrites=true&w=majority&appName=newone';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || ATLAS_URI;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });
    console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed default accounts into MongoDB if User collection is empty
    try {
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('[Database] Initializing default enterprise users into MongoDB...');
        const { SEED_USERS } = require('../data/seedData');
        for (const u of SEED_USERS) {
          await User.create(u);
        }
        console.log(`[Database] Successfully seeded ${SEED_USERS.length} default users into MongoDB.`);
      }
    } catch (seedErr) {
      console.warn('[Database Warning] Initial user auto-seed notice:', seedErr.message);
    }
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed (${error.message}).`);
    console.log(`[Database Notice] OceanCharter AI will run with resilient dynamic fallback data & mock persistence store.`);
  }
};

const getIsConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };

