// backend/controllers/routeController.js
const { getDistanceNM, calculateTotalCost } = require('../services/costService');
const { calculateDemurrageRisk } = require('../services/riskService');
const { checkFeasibility } = require('../services/feasibilityService');

const ROUTE_WAYPOINTS = {
  'Gladstone-Paradip': [
    { name: 'Gladstone Port (Loading)', lat: -23.843, lng: 151.258 },
    { name: 'Torres Strait Passage', lat: -10.583, lng: 142.216 },
    { name: 'Arafura / Timor Sea', lat: -9.500, lng: 130.000 },
    { name: 'Lombok Strait Transiting', lat: -8.700, lng: 115.750 },
    { name: 'Eastern Indian Ocean Corridor', lat: 2.000, lng: 92.000 },
    { name: 'Bay of Bengal Approach', lat: 15.000, lng: 88.000 },
    { name: 'Paradip Port Fairway Buoy', lat: 20.264, lng: 86.669 }
  ],
  'Gladstone-Haldia': [
    { name: 'Gladstone Port (Loading)', lat: -23.843, lng: 151.258 },
    { name: 'Torres Strait Passage', lat: -10.583, lng: 142.216 },
    { name: 'Malacca Strait Entrance', lat: 5.600, lng: 95.300 },
    { name: 'Andaman Sea North Corridor', lat: 13.000, lng: 92.500 },
    { name: 'Sandheads Pilot Boarding Ground', lat: 21.650, lng: 88.010 },
    { name: 'Hooghly River Navigation Channel', lat: 21.900, lng: 88.030 },
    { name: 'Haldia Dock Complex', lat: 22.025, lng: 88.058 }
  ],
  'Gladstone-Dhamra': [
    { name: 'Gladstone Port (Loading)', lat: -23.843, lng: 151.258 },
    { name: 'Torres Strait Passage', lat: -10.583, lng: 142.216 },
    { name: 'Indian Ocean Open Seaway', lat: 5.000, lng: 90.000 },
    { name: 'Bay of Bengal Deepwater Channel', lat: 17.500, lng: 87.500 },
    { name: 'Dhamra Deepwater Bulk Terminal', lat: 20.803, lng: 86.963 }
  ],
  'Gladstone-Visakhapatnam': [
    { name: 'Gladstone Port (Loading)', lat: -23.843, lng: 151.258 },
    { name: 'Torres Strait Passage', lat: -10.583, lng: 142.216 },
    { name: 'Sunda Strait Corridor', lat: -6.000, lng: 105.000 },
    { name: 'Bay of Bengal Southern Approach', lat: 12.000, lng: 86.000 },
    { name: 'Visakhapatnam Outer Harbour', lat: 17.686, lng: 83.218 }
  ]
};

// @desc Optimize and compare shipping routes
// @route POST /api/routes/optimize
const optimizeRoute = async (req, res, next) => {
  try {
    const {
      origin = 'Gladstone',
      destination = 'Paradip',
      vesselClass = 'PANAMAX',
      cargoQuantity = 70000,
      cargoType = 'Coking Coal',
      priority = 'Balanced'
    } = req.body;

    const parsedQty = parseFloat(cargoQuantity) || 70000;

    // Candidate destination routes from this origin
    const targetDestinations = ['Paradip', 'Dhamra', 'Visakhapatnam', 'Haldia', 'Gangavaram'];

    const evaluatedRoutes = targetDestinations.map(dest => {
      const distanceNM = getDistanceNM(origin, dest);
      const feas = checkFeasibility({ cargoQuantity: parsedQty, cargoType, origin, destination: dest, vesselClass });
      const costRes = calculateTotalCost({ cargoQuantity: parsedQty, cargoType, origin, destination: dest, vesselClass });
      const riskRes = calculateDemurrageRisk({ destination: dest, vesselClass });

      // Multi-criteria optimization scoring
      let score = 80;
      if (!feas.isFeasible) score -= 45;
      score -= Math.round(riskRes.riskScore * 0.35);
      score += Math.max(0, Math.round(35 - (costRes.costs.costPerMT * 0.8)));

      const routeKey = `${origin}-${dest}`;
      const waypoints = ROUTE_WAYPOINTS[routeKey] || [
        { name: `${origin} (Loading Port)`, lat: -23.843, lng: 151.258 },
        { name: 'Indian Ocean Seaway', lat: 2.0, lng: 92.0 },
        { name: `${dest} (Discharge Port)`, lat: 18.0, lng: 84.0 }
      ];

      return {
        origin,
        destination: dest,
        routeName: `${origin} → ${dest}`,
        distanceNM,
        sailingDays: costRes.sailingDays,
        waitingDays: costRes.waitingDays,
        dischargeDays: costRes.dischargeDays,
        totalVoyageDays: costRes.totalVoyageDays,
        freightCost: costRes.costs.oceanFreightCost,
        bunkerCost: costRes.costs.bunkerCost,
        demurrageExposure: costRes.costs.expectedDemurrageCost,
        totalLandedCost: costRes.costs.totalLandedCost,
        costPerMT: costRes.costs.costPerMT,
        riskScore: riskRes.riskScore,
        riskLevel: riskRes.riskLevel,
        isFeasible: feas.isFeasible,
        feasibilityStatus: feas.feasibilityStatus,
        failedConstraints: feas.failedConstraints,
        optimizationScore: Math.min(99, Math.max(15, score)),
        waypoints
      };
    });

    // Sort by optimization score descending
    evaluatedRoutes.sort((a, b) => b.optimizationScore - a.optimizationScore);

    res.json({
      success: true,
      origin,
      preferredDestination: destination,
      priority,
      vesselClass,
      bestRoute: evaluatedRoutes[0],
      routes: evaluatedRoutes,
      dataQuality: 'SIMULATED'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  optimizeRoute
};
