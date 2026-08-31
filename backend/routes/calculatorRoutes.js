// backend/routes/calculatorRoutes.js
const express = require('express');
const router = express.Router();
const { calculateCharterCost } = require('../controllers/calculatorController');

router.post('/', calculateCharterCost);

module.exports = router;
