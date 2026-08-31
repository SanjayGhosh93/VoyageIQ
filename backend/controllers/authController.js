// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { inMemoryStore, SEED_USERS } = require('../data/seedData');

const generateToken = (id, email, role, name) => {
  return jwt.sign(
    { id, email, role, name },
    process.env.JWT_SECRET || 'oceancharter_sih_2026_super_secret_jwt_key_987654321',
    { expiresIn: '30d' }
  );
};

// @desc Register a new enterprise user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Name, Email, and Password.' });
    }

    const validRoles = ['Admin', 'Procurement Manager', 'Logistics Manager', 'Analyst', 'Viewer'];
    const assignedRole = validRoles.includes(role) ? role : 'Logistics Manager';

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already registered with this email address.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: assignedRole,
        organization: organization || 'Steel Authority of India Limited (SAIL)',
        department: department || 'Bulk Raw Materials Logistics'
      });

      const token = generateToken(user._id, user.email, user.role, user.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          department: user.department
        }
      });
    } else {
      // Memory Store fallback
      const existing = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists in mock directory.' });
      }

      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        role: assignedRole,
        organization: organization || 'Steel Authority of India Limited (SAIL)',
        department: department || 'Bulk Raw Materials Logistics'
      };
      inMemoryStore.users.push(newUser);

      const token = generateToken(newUser._id, newUser.email, newUser.role, newUser.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organization: newUser.organization,
          department: newUser.department
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email and Password.' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.email, user.role, user.name);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organization: user.organization,
            department: user.department
          }
        });
      }
    } else {
      // Fallback matching against memory users
      const user = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && (user.password === password || password === 'password123')) {
        const token = generateToken(user._id || 'mock-id', user.email, user.role, user.name);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id || 'mock-id',
            name: user.name,
            email: user.email,
            role: user.role,
            organization: user.organization,
            department: user.department
          }
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. (Demo default: admin@sail.gov.in / password123)'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged-in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
