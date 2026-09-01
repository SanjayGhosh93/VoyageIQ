// backend/server.js
// OceanCharter AI - Intelligent Freight Forecasting & Vessel Matcher
// Problem Statement ID: SIH26006 | Ministry of Steel / SAIL

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const { connectMySQL } = require('./config/mysql');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const portRoutes = require('./routes/portRoutes');
const vesselRoutes = require('./routes/vesselRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const feasibilityRoutes = require('./routes/feasibilityRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const riskRoutes = require('./routes/riskRoutes');
const routeRoutes = require('./routes/routeRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');
const marketRoutes = require('./routes/marketRoutes');
const realtimeRoutes = require('./routes/realtimeRoutes');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Databases (with resilient fallbacks)
connectDB();
connectMySQL();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'OceanCharter AI Backend API',
    problemStatement: 'SIH26006',
    client: 'Ministry of Steel / SAIL',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/ports', portRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/feasibility', feasibilityRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/realtime', realtimeRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` OCEANCHARTER AI BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(` Predict Freight. Match Vessels. Reduce Demurrage.`);
  console.log(` Problem Statement ID: SIH26006 | SAIL`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health URL: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = app;