// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuthLog = require('../models/AuthLog');
const { getIsConnected } = require('../config/db');
const { inMemoryStore, SEED_USERS } = require('../data/seedData');

const generateToken = (id, email, role, name) => {
  return jwt.sign(
    { id, email, role, name },
    process.env.JWT_SECRET || 'oceancharter_sih_2026_super_secret_jwt_key_987654321',
    { expiresIn: '30d' }
  );
};

// Extract client metadata for audit tracking
const getClientMeta = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || req.ip || '127.0.0.1');
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  return { ip, userAgent };
};

// @desc Register a new enterprise user & record real-time event in MongoDB
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, department } = req.body;
    const meta = getClientMeta(req);

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Name, Email, and Password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validRoles = ['Admin', 'Procurement Manager', 'Logistics Manager', 'Analyst', 'Viewer'];
    const assignedRole = validRoles.includes(role) ? role : 'Logistics Manager';
    const org = organization ? organization.trim() : 'Steel Authority of India Limited (SAIL)';
    const dept = department ? department.trim() : 'Bulk Raw Materials Logistics';

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        // Record failed registration attempt in MongoDB
        try {
          await AuthLog.create({
            action: 'REGISTER',
            email: normalizedEmail,
            name: name.trim(),
            role: assignedRole,
            organization: org,
            status: 'FAILED',
            ip: meta.ip,
            userAgent: meta.userAgent,
            details: 'Registration rejected: Email already registered'
          });
        } catch (logErr) {
          console.warn('[Audit Log Warning]', logErr.message);
        }

        return res.status(400).json({ success: false, message: 'User already registered with this email address.' });
      }

      // Create new user in MongoDB Atlas
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: assignedRole,
        organization: org,
        department: dept,
        loginCount: 1,
        lastLogin: new Date(),
        lastLoginIp: meta.ip
      });

      // Record real-time registration event in MongoDB
      try {
        await AuthLog.create({
          action: 'REGISTER',
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          status: 'SUCCESS',
          ip: meta.ip,
          userAgent: meta.userAgent,
          details: `Registered new officer account: ${user.name} (${user.role})`
        });
      } catch (logErr) {
        console.warn('[Audit Log Warning]', logErr.message);
      }

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
          department: user.department,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        }
      });
    } else {
      // Memory Store fallback
      const existing = inMemoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists in mock directory.' });
      }

      const newUser = {
        _id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: assignedRole,
        organization: org,
        department: dept,
        lastLogin: new Date(),
        loginCount: 1
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
          department: newUser.department,
          lastLogin: newUser.lastLogin,
          loginCount: newUser.loginCount
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Authenticate user, update last login, & record real-time event in MongoDB
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const meta = getClientMeta(req);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email and Password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (getIsConnected()) {
      const user = await User.findOne({ email: normalizedEmail });

      if (user && (await user.matchPassword(password))) {
        // Update user's last login and count in MongoDB
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLoginIp = meta.ip;
        await user.save({ validateBeforeSave: false });

        // Record real-time sign-in event in MongoDB
        try {
          await AuthLog.create({
            action: 'LOGIN',
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            organization: user.organization,
            status: 'SUCCESS',
            ip: meta.ip,
            userAgent: meta.userAgent,
            details: `Successful sign-in (Login #${user.loginCount})`
          });
        } catch (logErr) {
          console.warn('[Audit Log Warning]', logErr.message);
        }

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
            department: user.department,
            lastLogin: user.lastLogin,
            loginCount: user.loginCount
          }
        });
      }

      // Record failed sign-in attempt in MongoDB
      try {
        await AuthLog.create({
          action: 'LOGIN_FAILED',
          email: normalizedEmail,
          name: user ? user.name : 'Unknown User',
          role: user ? user.role : 'Guest',
          organization: user ? user.organization : 'N/A',
          status: 'FAILED',
          ip: meta.ip,
          userAgent: meta.userAgent,
          details: user ? 'Incorrect password entered' : 'Email address not found'
        });
      } catch (logErr) {
        console.warn('[Audit Log Warning]', logErr.message);
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    } else {
      // Fallback matching against memory users
      const user = inMemoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
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
            department: user.department,
            lastLogin: new Date(),
            loginCount: 1
          }
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. (Demo default: admin@sail.gov.in / password123)'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get real-time sign-in and register activity logs from MongoDB
// @route GET /api/auth/logs
const getAuthLogs = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    if (getIsConnected()) {
      const logs = await AuthLog.find().sort({ createdAt: -1 }).limit(limit);
      const totalCount = await AuthLog.countDocuments();
      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        count: logs.length,
        total: totalCount,
        logs
      });
    } else {
      return res.json({
        success: true,
        source: 'MemoryStore',
        count: 0,
        total: 0,
        logs: []
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get all registered enterprise users from MongoDB
// @route GET /api/auth/users
const getAllUsers = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        count: users.length,
        users
      });
    } else {
      return res.json({
        success: true,
        source: 'MemoryStore',
        count: inMemoryStore.users.length,
        users: inMemoryStore.users.map(({ password, ...u }) => u)
      });
    }
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

// @desc Get real-time database connection status, user count & recent activity
// @route GET /api/auth/status
const getAuthStatus = async (req, res, next) => {
  try {
    const isMongoConnected = getIsConnected();
    let userCount = 0;
    let recentLogs = [];

    if (isMongoConnected) {
      userCount = await User.countDocuments();
      recentLogs = await AuthLog.find().sort({ createdAt: -1 }).limit(6);
    } else {
      userCount = inMemoryStore.users.length;
    }

    res.json({
      success: true,
      connected: isMongoConnected,
      database: isMongoConnected ? 'MongoDB Atlas' : 'MemoryStore Fallback',
      cluster: 'newone.ornd32t.mongodb.net',
      dbName: 'oceancharter',
      userCount,
      recentLogs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getAuthLogs,
  getAllUsers,
  getMe,
  getAuthStatus
};

