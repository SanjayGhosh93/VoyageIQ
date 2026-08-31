const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Procurement Manager', 'Logistics Manager', 'Analyst', 'Viewer'],
    default: 'Logistics Manager'
  },
  organization: { type: String, default: 'SAIL (Steel Authority of India Ltd)' },
  department: { type: String, default: 'Bulk Raw Material Logistics' },
  avatarUrl: { type: String },
  dataQuality: { type: String, default: 'VERIFIED' },
  confidence: { type: Number, default: 0.98 },
  source: { type: String, default: 'SAIL Single Sign-On / Local Security' }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
