// backend/controllers/calculatorController.js
const { calculateTotalCost } = require('../services/costService');
const { calculateDemurrageRisk } = require('../services/riskService');
const { checkFeasibility } = require('../services/feasibilityService');

// @desc Calculate detailed chartering landed cost and What-If sensitivity
// @route POST /api/calculator
const calculateCharterCost = async (req, res, next) => {
  try {
    const {
      cargoQuantity = 70000,
      cargoType = 'Coking Coal',
      origin = 'Gladstone',
      destination = 'Paradip',
      vesselClass = 'PANAMAX',
      contractType = 'Spot Voyage',
      freightRate = 18.42,
      fuelPrice = 620,
      demurrageRate = 20000,
      expectedWaiting = 2.5,
      handlingRate = 1500,
      fuelPriceDeltaPct = 0,
      freightRateDeltaPct = 0,
      overrideWaitingDays = null
    } = req.body;

    const parsedQty = parseFloat(cargoQuantity) || 70000;
    const parsedFreight = parseFloat(freightRate) || 18.42;
    const parsedFuel = parseFloat(fuelPrice) || 620;
    const parsedDemurrage = parseFloat(demurrageRate) || 20000;
    const parsedWaiting = expectedWaiting !== undefined ? parseFloat(expectedWaiting) : 2.5;

    const costResult = calculateTotalCost({
      cargoQuantity: parsedQty,
      cargoType,
      origin,
      destination,
      vesselClass,
      contractType,
      baseFreightRate: parsedFreight,
      baseFuelPrice: parsedFuel,
      demurrageRatePerDay: parsedDemurrage,
      expectedWaitingDays: parsedWaiting,
      handlingRateTPH: parseFloat(handlingRate) || 1500,
      fuelPriceDeltaPct: parseFloat(fuelPriceDeltaPct) || 0,
      freightRateDeltaPct: parseFloat(freightRateDeltaPct) || 0,
      overrideWaitingDays: overrideWaitingDays !== null && overrideWaitingDays !== undefined ? parseFloat(overrideWaitingDays) : null
    });

    const riskResult = calculateDemurrageRisk({
      destination,
      vesselClass,
      overrideQueue: Math.round(parsedWaiting * 1.5)
    });

    const feas = checkFeasibility({
      cargoQuantity: parsedQty,
      cargoType,
      origin,
      destination,
      vesselClass
    });

    res.json({
      success: true,
      data: {
        ...costResult,
        feasibility: {
          status: feas.feasibilityStatus,
          isFeasible: feas.isFeasible,
          failedConstraints: feas.failedConstraints,
          warnings: feas.warnings
        },
        risk: {
          score: riskResult.riskScore,
          level: riskResult.riskLevel,
          topContributors: riskResult.topContributors
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateCharterCost
};
