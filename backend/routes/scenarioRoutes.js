// backend/routes/scenarioRoutes.js
const express = require('express');
const router = express.Router();
const {
  getScenarios,
  createScenario,
  getScenarioById,
  updateScenario,
  deleteScenario
} = require('../controllers/scenarioController');

router.route('/')
  .get(getScenarios)
  .post(createScenario);

router.route('/:id')
  .get(getScenarioById)
  .put(updateScenario)
  .delete(deleteScenario);

module.exports = router;
