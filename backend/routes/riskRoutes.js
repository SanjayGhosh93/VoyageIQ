// backend/routes/riskRoutes.js
const express = require('express');
const router = express.Router();
const { calculateDemurrageRiskEndpoint } = require('../controllers/riskController');

router.post('/calculate', calculateDemurrageRiskEndpoint);

module.exports = router;
