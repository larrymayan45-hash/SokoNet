/**
 * Wallet Service
 * Handles core wallet operations and balance movements.
 */

const Wallet = require('../models/Wallet');

class WalletService {
  async getOrCreateWallet(userId, currency = 'KES') {
    const normalizedCurrency = currency.toUpperCase();

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, currency: normalizedCurrency });
      await wallet.save();
    }

    return wallet;
  }

  async deposit(userId, amount, currency = 'KES') {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero');
    }

    const wallet = await this.getOrCreateWallet(userId, currency);
    wallet.pendingBalance += Number(amount);
    wallet.currency = currency.toUpperCase();
    wallet.updatedAt = new Date();
    await wallet.save();

    return wallet;
  }

  async releasePending(userId, amount) {
    if (amount <= 0) {
      throw new Error('Release amount must be greater than zero');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.pendingBalance < amount) {
      throw new Error('Pending balance is insufficient');
    }

    wallet.pendingBalance -= amount;
    wallet.balance += Number(amount);
    wallet.updatedAt = new Date();
    await wallet.save();

    return wallet;
  }

  async withdraw(userId, amount) {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than zero');
    }

    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    wallet.balance -= Number(amount);
    wallet.updatedAt = new Date();
    await wallet.save();

    return wallet;
  }
}

module.exports = new WalletService();
