// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');

router.post('/', generateReport);

module.exports = router;
