// backend/routes/feasibilityRoutes.js
const express = require('express');
const router = express.Router();
const { checkFeasibilityEndpoint } = require('../controllers/feasibilityController');

router.post('/check', checkFeasibilityEndpoint);

module.exports = router;
