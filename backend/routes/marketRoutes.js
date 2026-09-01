// backend/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const { getCargoHistory, getMarketOverview, getFreightHistory } = require('../controllers/marketController');

// @route   GET /api/market & GET /api/market/overview
// @desc    Get top-level market indicators
router.get('/', getMarketOverview);
router.get('/overview', getMarketOverview);

// @route   GET /api/market/cargo
// @desc    Get historical cargo dataset from MySQL
router.get('/cargo', getCargoHistory);

// @route   GET /api/market/history
// @desc    Get historical freight rate time-series
router.get('/history', getFreightHistory);

module.exports = router;