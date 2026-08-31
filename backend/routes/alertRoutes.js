// backend/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const { getAlerts, acknowledgeAlert } = require('../controllers/alertController');

router.get('/', getAlerts);
router.put('/:id/ack', acknowledgeAlert);

module.exports = router;
