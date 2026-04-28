/**
 * ExchangeRate Model
 * Caches exchange rates against base currency KES
 */

const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  rate: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    default: 'exchange-rate-host'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour cache
  }
}, { timestamps: true });

exchangeRateSchema.index({ currency: 1 });

module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
