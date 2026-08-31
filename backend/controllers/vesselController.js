// backend/controllers/vesselController.js
const Vessel = require('../models/Vessel');
const { getIsConnected } = require('../config/db');
const { VESSEL_SPECS } = require('../services/feasibilityService');
const { getLiveVessels } = require('../services/liveMarineService');

// @desc Get all fleet vessels with real-time live AIS telemetry
// @route GET /api/vessels
const getAllVessels = async (req, res, next) => {
  try {
    const { vesselClass, status } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (vesselClass) query.vesselClass = vesselClass;
      if (status) query.status = status;
      const vessels = await Vessel.find(query).sort({ dwt: -1 });
      if (vessels && vessels.length > 0) {
        return res.json({ 
          success: true, 
          count: vessels.length, 
          vesselClasses: VESSEL_SPECS,
          data: vessels,
          dataSource: 'LIVE_DATABASE'
        });
      }
    }

    // Live AIS Streaming Telemetry
    let liveFleet = getLiveVessels();
    if (vesselClass) liveFleet = liveFleet.filter(v => v.vesselClass === vesselClass);
    if (status) liveFleet = liveFleet.filter(v => v.status === status);

    return res.json({ 
      success: true, 
      count: liveFleet.length, 
      vesselClasses: VESSEL_SPECS,
      data: liveFleet,
      dataSource: 'LIVE_AIS_STREAMING',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single vessel by ID or IMO
// @route GET /api/vessels/:id
const getVesselById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      let vessel;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        vessel = await Vessel.findById(id);
      } else {
        vessel = await Vessel.findOne({ imoNumber: id });
      }

      if (!vessel) {
        return res.status(404).json({ success: false, message: `Vessel with identifier '${id}' not found.` });
      }
      return res.json({ success: true, data: vessel });
    } else {
      const vessels = inMemoryStore.vessels || SEED_VESSELS;
      const vessel = vessels.find(v => v._id === id || v.imoNumber === id || v.name.toLowerCase() === id.toLowerCase());
      if (!vessel) {
        return res.status(404).json({ success: false, message: `Vessel with identifier '${id}' not found.` });
      }
      return res.json({ success: true, data: vessel });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVessels,
  getVesselById
};
