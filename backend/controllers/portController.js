// backend/controllers/portController.js
const Port = require('../models/Port');
const { getIsConnected } = require('../config/db');
const { inMemoryStore, SEED_PORTS } = require('../data/seedData');
const { fetchLivePortWeather } = require('../services/liveMarineService');

// @desc Get all ports (origin and destination) with live marine weather
// @route GET /api/ports
const getAllPorts = async (req, res, next) => {
  try {
    const { region, vesselClass } = req.query;
    const liveWeather = await fetchLivePortWeather().catch(() => ({}));

    let ports = [];
    if (getIsConnected()) {
      let query = {};
      if (region) query.region = region;
      if (vesselClass) query.compatibleVesselClasses = vesselClass;
      ports = await Port.find(query).sort({ name: 1 });
    }
    
    if (!ports || ports.length === 0) {
      ports = inMemoryStore.ports || SEED_PORTS;
      if (region) ports = ports.filter(p => p.region === region);
      if (vesselClass) ports = ports.filter(p => p.compatibleVesselClasses && p.compatibleVesselClasses.includes(vesselClass));
    }

    // Attach live weather
    const enrichedPorts = ports.map(p => {
      const portObj = p.toObject ? p.toObject() : { ...p };
      portObj.liveWeather = liveWeather[p.name] || null;
      return portObj;
    });

    return res.json({ 
      success: true, 
      count: enrichedPorts.length, 
      data: enrichedPorts,
      dataSource: 'LIVE_PORTS_HYDROGRAPHIC_REGISTRY'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single port by name or ID
// @route GET /api/ports/:id
const getPortById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      let port;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        port = await Port.findById(id);
      } else {
        port = await Port.findOne({ name: new RegExp('^' + id + '$', 'i') });
      }

      if (!port) {
        return res.status(404).json({ success: false, message: `Port '${id}' not found.` });
      }
      return res.json({ success: true, data: port });
    } else {
      const ports = inMemoryStore.ports || SEED_PORTS;
      const port = ports.find(p => p.name.toLowerCase() === id.toLowerCase() || p.code === id.toUpperCase());
      if (!port) {
        return res.status(404).json({ success: false, message: `Port '${id}' not found in registry.` });
      }
      return res.json({ success: true, data: port });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Add a new port definition
// @route POST /api/ports
const createPort = async (req, res, next) => {
  try {
    const portData = req.body;
    if (!portData.name || !portData.country || !portData.berthDraft) {
      return res.status(400).json({ success: false, message: 'Port Name, Country, and Berth Draft are mandatory.' });
    }

    if (getIsConnected()) {
      const created = await Port.create(portData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newPort = { ...portData, _id: `port-${Date.now()}` };
      inMemoryStore.ports.push(newPort);
      return res.status(201).json({ success: true, data: newPort });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPorts,
  getPortById,
  createPort
};
