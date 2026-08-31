// backend/controllers/riskController.js
const { calculateDemurrageRisk } = require('../services/riskService');
const { PORT_SPECS } = require('../services/feasibilityService');

// @desc Calculate Demurrage Risk (0 - 100) and top contributors
// @route POST /api/risk/calculate
const calculateDemurrageRiskEndpoint = async (req, res, next) => {
  try {
    const {
      destination = 'Paradip',
      vesselClass = 'PANAMAX',
      weatherScore = 20,
      overrideQueue = null,
      overrideMonsoon = null
    } = req.body;

    const result = calculateDemurrageRisk({
      destination,
      vesselClass,
      weatherScore: parseFloat(weatherScore) || 20,
      overrideQueue: overrideQueue !== null ? parseInt(overrideQueue, 10) : null,
      overrideMonsoon
    });

    // Provide comparison across all Indian East Coast Ports
    const eastCoastPorts = ['Haldia', 'Sagar / Sandheads', 'Paradip', 'Dhamra', 'Visakhapatnam', 'Gangavaram', 'Gopalpur', 'Chennai', 'Kamarajar'];
    const comparativePortRisks = eastCoastPorts.map(p => {
      const r = calculateDemurrageRisk({ destination: p, vesselClass });
      return {
        portName: p,
        riskScore: r.riskScore,
        riskLevel: r.riskLevel,
        berthDraft: PORT_SPECS[p]?.berthDraft || 14.0,
        queueLength: PORT_SPECS[p]?.queueLength || 3,
        avgWaitingDays: PORT_SPECS[p]?.avgWaitingDays || 2.0
      };
    });

    res.json({
      success: true,
      data: {
        ...result,
        comparativePortRisks
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateDemurrageRiskEndpoint
};
