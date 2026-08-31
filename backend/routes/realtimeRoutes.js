// backend/routes/realtimeRoutes.js
const express = require('express');
const router = express.Router();
const { fetchLivePortWeather, getLiveMarketTicker, getLiveVessels } = require('../services/liveMarineService');

/**
 * @route   GET /api/realtime/market-feed
 * @desc    Get live dynamic Baltic Dry Index, Bunker Fuel, and Coking Coal Tickers
 */
router.get('/market-feed', (req, res) => {
  try {
    const liveFeed = getLiveMarketTicker();
    res.json({
      success: true,
      data: liveFeed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   GET /api/realtime/port-weather
 * @desc    Get live weather, sea swell, and monsoon risk from Open-Meteo API
 */
router.get('/port-weather', async (req, res) => {
  try {
    const liveWeather = await fetchLivePortWeather();
    res.json({
      success: true,
      data: liveWeather
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   GET /api/realtime/vessels
 * @desc    Get live AIS telemetry for active vessels on India East Coast procurement routes
 */
router.get('/vessels', (req, res) => {
  try {
    const vessels = getLiveVessels();
    res.json({
      success: true,
      count: vessels.length,
      data: vessels
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
