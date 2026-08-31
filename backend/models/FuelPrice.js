const mongoose = require('mongoose');

const fuelPriceSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  bunkerPort: { type: String, required: true }, // e.g. Singapore, Fujairah, Visakhapatnam, Paradip
  vlsfoPerMT: { type: Number, required: true }, // Very Low Sulfur Fuel Oil USD/MT
  mgoPerMT: { type: Number, required: true }, // Marine Gas Oil USD/MT
  hfoPerMT: { type: Number, required: true }, // Heavy Fuel Oil
  dataQuality: { type: String, default: 'SIMULATED' },
  source: { type: String, default: 'Ship & Bunker Index' }
}, {
  timestamps: true
});

module.exports = mongoose.model('FuelPrice', fuelPriceSchema);
