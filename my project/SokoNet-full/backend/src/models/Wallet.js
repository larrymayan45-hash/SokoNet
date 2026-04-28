/**
 * Wallet Model
 * Tracks user wallet balances, pending balance, and currency.
 */

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currency: {
    type: String,
    uppercase: true,
    default: 'KES'
  },
  balance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

walletSchema.index({ userId: 1 });

module.exports = mongoose.model('Wallet', walletSchema);
