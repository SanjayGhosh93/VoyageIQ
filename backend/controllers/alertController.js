// backend/controllers/alertController.js
const Alert = require('../models/Alert');
const { getIsConnected } = require('../config/db');
const { inMemoryStore, SEED_ALERTS } = require('../data/seedData');

// @desc Get all active early warning alerts
// @route GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const { category, severity } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (category) query.category = category;
      if (severity) query.severity = severity;
      const alerts = await Alert.find(query).sort({ timestamp: -1 });
      return res.json({ success: true, count: alerts.length, data: alerts });
    } else {
      let alerts = inMemoryStore.alerts || SEED_ALERTS;
      if (category) alerts = alerts.filter(a => a.category === category);
      if (severity) alerts = alerts.filter(a => a.severity === severity);
      return res.json({ success: true, count: alerts.length, data: alerts });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Acknowledge alert
// @route PUT /api/alerts/:id/ack
const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const updated = await Alert.findByIdAndUpdate(id, { isAcknowledged: true }, { new: true });
      return res.json({ success: true, data: updated });
    } else {
      const alerts = inMemoryStore.alerts || SEED_ALERTS;
      const alert = alerts.find(a => a._id === id || a.title?.includes(id));
      if (alert) alert.isAcknowledged = true;
      return res.json({ success: true, data: alert });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  acknowledgeAlert
};
