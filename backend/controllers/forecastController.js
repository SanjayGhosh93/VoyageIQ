// backend/controllers/forecastController.js
const { forecastFreightRates } = require('../services/forecastService');

// @desc Run predictive freight forecast
// @route POST /api/forecast
const generateForecast = async (req, res, next) => {
  try {
    const {
      origin = 'Gladstone',
      destination = 'Paradip',
      vesselClass = 'PANAMAX',
      cargoType = 'Coking Coal',
      cargoQuantity = 70000,
      horizonDays = 30
    } = req.body;

    const parsedHorizon = parseInt(horizonDays, 10) || 30;
    const parsedQty = parseFloat(cargoQuantity) || 70000;

    const result = forecastFreightRates({
      origin,
      destination,
      vesselClass,
      cargoType,
      cargoQuantity: parsedQty,
      horizonDays: parsedHorizon
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateForecast
};
