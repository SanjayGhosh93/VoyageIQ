// backend/controllers/scenarioController.js
const Scenario = require('../models/Scenario');
const { getIsConnected } = require('../config/db');
const { inMemoryStore, SEED_SCENARIOS } = require('../data/seedData');
const { checkFeasibility } = require('../services/feasibilityService');
const { calculateTotalCost } = require('../services/costService');
const { calculateDemurrageRisk } = require('../services/riskService');
const { generateAlternatives } = require('../services/optimizationService');

// @desc Get all scenarios
// @route GET /api/scenarios
const getScenarios = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const scenarios = await Scenario.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: scenarios.length, data: scenarios });
    } else {
      const scenarios = inMemoryStore.scenarios || SEED_SCENARIOS;
      return res.json({ success: true, count: scenarios.length, data: scenarios });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create a new scenario
// @route POST /api/scenarios
const createScenario = async (req, res, next) => {
  try {
    const {
      title,
      description,
      cargoType = 'Coking Coal',
      cargoQuantityMT = 70000,
      originPort = 'Gladstone',
      destinationPort = 'Paradip',
      vesselClass = 'PANAMAX',
      contractType = 'Spot Voyage'
    } = req.body;

    if (!title || !cargoQuantityMT || !originPort || !destinationPort || !vesselClass) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory scenario parameters.' });
    }

    const parsedQty = parseFloat(cargoQuantityMT);
    const feas = checkFeasibility({ cargoQuantity: parsedQty, cargoType, origin: originPort, destination: destinationPort, vesselClass });
    const costRes = calculateTotalCost({ cargoQuantity: parsedQty, cargoType, origin: originPort, destination: destinationPort, vesselClass, contractType });
    const riskRes = calculateDemurrageRisk({ destination: destinationPort, vesselClass });
    const altPack = generateAlternatives({ cargoQuantity: parsedQty, cargoType, origin: originPort, destination: destinationPort, vesselClass });

    const scenarioPayload = {
      title,
      description: description || `Charter plan: ${parsedQty.toLocaleString()} MT ${cargoType} (${originPort} → ${destinationPort}) via ${vesselClass}`,
      cargoType,
      cargoQuantityMT: parsedQty,
      originPort,
      destinationPort,
      vesselClass,
      contractType,
      isFeasible: feas.isFeasible,
      feasibilityStatus: feas.feasibilityStatus,
      failedConstraints: feas.failedConstraints,
      warnings: feas.warnings,
      compatibilityScore: feas.compatibilityScore,
      riskScore: riskRes.riskScore,
      freightRateUSDPerMT: costRes.ratesUsed.freightRatePerMT,
      oceanFreightCostUSD: costRes.costs.oceanFreightCost,
      bunkerCostUSD: costRes.costs.bunkerCost,
      portTariffCostUSD: costRes.costs.portTariffCost,
      handlingCostUSD: costRes.costs.handlingCost,
      lighteringCostUSD: costRes.costs.lighteringCost,
      demurrageExposureUSD: costRes.costs.expectedDemurrageCost,
      totalLandedCostUSD: costRes.costs.totalLandedCost,
      costPerMT: costRes.costs.costPerMT,
      transitDays: costRes.sailingDays,
      waitingDays: costRes.waitingDays,
      dischargeDays: costRes.dischargeDays,
      totalVoyageDays: costRes.totalVoyageDays,
      optimizationScore: feas.isFeasible ? Math.max(50, 100 - riskRes.riskScore) : 25,
      tag: !feas.isFeasible ? 'INFEASIBLE' : (riskRes.riskScore < 30 ? 'BEST_VALUE' : 'ALTERNATIVE'),
      recommendedAction: feas.isFeasible ? `Proceed with ${vesselClass} booking on ${contractType}` : `Reroute to ${altPack.recommendedAlternative?.destination || 'Paradip'}`
    };

    if (getIsConnected()) {
      const created = await Scenario.create(scenarioPayload);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newScenario = {
        ...scenarioPayload,
        _id: `scenario-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.scenarios.unshift(newScenario);
      return res.status(201).json({ success: true, data: newScenario });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get single scenario by ID
// @route GET /api/scenarios/:id
const getScenarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const scenario = await Scenario.findById(id);
      if (!scenario) return res.status(404).json({ success: false, message: 'Scenario not found' });
      return res.json({ success: true, data: scenario });
    } else {
      const scenarios = inMemoryStore.scenarios || SEED_SCENARIOS;
      const scenario = scenarios.find(s => s._id === id || s.title?.toLowerCase().includes(id.toLowerCase()));
      if (!scenario) return res.status(404).json({ success: false, message: 'Scenario not found' });
      return res.json({ success: true, data: scenario });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update scenario
// @route PUT /api/scenarios/:id
const updateScenario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (getIsConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const updated = await Scenario.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Scenario not found' });
      return res.json({ success: true, data: updated });
    } else {
      const scenarios = inMemoryStore.scenarios || SEED_SCENARIOS;
      const idx = scenarios.findIndex(s => s._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Scenario not found' });
      scenarios[idx] = { ...scenarios[idx], ...updateData };
      return res.json({ success: true, data: scenarios[idx] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete scenario
// @route DELETE /api/scenarios/:id
const deleteScenario = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      await Scenario.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Scenario deleted successfully' });
    } else {
      inMemoryStore.scenarios = (inMemoryStore.scenarios || SEED_SCENARIOS).filter(s => s._id !== id);
      return res.json({ success: true, message: 'Scenario deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScenarios,
  createScenario,
  getScenarioById,
  updateScenario,
  deleteScenario
};
