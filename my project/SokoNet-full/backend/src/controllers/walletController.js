/**
 * Wallet Controller
 * API endpoints for wallet retrieval and operations.
 */

const WalletService = require('../services/WalletService');

class WalletController {
  async getWallet(req, res) {
    try {
      const wallet = await WalletService.getOrCreateWallet(req.user.userId);
      res.json({ success: true, wallet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deposit(req, res) {
    try {
      const { amount, currency } = req.body;
      const wallet = await WalletService.deposit(req.user.userId, Number(amount), currency || 'KES');
      res.json({ success: true, wallet });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async releasePending(req, res) {
    try {
      const { amount } = req.body;
      const wallet = await WalletService.releasePending(req.user.userId, Number(amount));
      res.json({ success: true, wallet });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async withdraw(req, res) {
    try {
      const { amount } = req.body;
      const wallet = await WalletService.withdraw(req.user.userId, Number(amount));
      res.json({ success: true, wallet });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new WalletController();
