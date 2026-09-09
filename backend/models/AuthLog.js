const mongoose = require('mongoose');

const authLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['REGISTER', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT'],
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String
  },
  organization: {
    type: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    default: 'SUCCESS',
    index: true
  },
  ip: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String
  },
  details: {
    type: String
  }
}, {
  timestamps: true
});

// Index to quickly fetch recent activity in real time
authLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuthLog', authLogSchema);
