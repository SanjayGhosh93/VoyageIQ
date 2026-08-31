// backend/routes/forecastRoutes.js
const express = require('express');
const router = express.Router();
const { generateForecast } = require('../controllers/forecastController');

router.post('/', generateForecast);

module.exports = router;
