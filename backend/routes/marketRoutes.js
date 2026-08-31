// backend/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const { getMarketOverview, getFreightHistory } = require('../controllers/marketController');

router.get('/', getMarketOverview);
router.get('/history', getFreightHistory);

module.exports = router;
