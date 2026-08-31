// backend/routes/vesselRoutes.js
const express = require('express');
const router = express.Router();
const { getAllVessels, getVesselById } = require('../controllers/vesselController');

router.get('/', getAllVessels);
router.get('/:id', getVesselById);

module.exports = router;
