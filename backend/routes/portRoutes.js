// backend/routes/portRoutes.js
const express = require('express');
const router = express.Router();
const { getAllPorts, getPortById, createPort } = require('../controllers/portController');

router.get('/', getAllPorts);
router.get('/:id', getPortById);
router.post('/', createPort);

module.exports = router;
