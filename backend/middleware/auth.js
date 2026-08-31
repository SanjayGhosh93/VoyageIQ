// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { inMemoryStore } = require('../data/seedData');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Please log in to access this resource.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'oceancharter_sih_2026_super_secret_jwt_key_987654321');

    if (getIsConnected()) {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback to decoded info if user was created in mock mode
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'SAIL User',
          email: decoded.email,
          role: decoded.role || 'Logistics Manager',
          organization: 'Steel Authority of India Ltd (SAIL)'
        };
      }
    } else {
      // Memory store fallback
      const found = inMemoryStore.users.find(u => u.email === decoded.email);
      req.user = found || {
        _id: decoded.id || 'mock-user-1',
        name: decoded.name || 'SAIL Logistics Officer',
        email: decoded.email || 'admin@sail.gov.in',
        role: decoded.role || 'Logistics Manager',
        organization: 'Steel Authority of India Ltd (SAIL)'
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please re-authenticate.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'Viewer'}) is not authorized to perform this operation.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
