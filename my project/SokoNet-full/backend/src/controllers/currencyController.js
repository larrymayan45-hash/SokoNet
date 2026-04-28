/**
 * Currency Controller
 * Exposes currency and exchange rate APIs
 */

const CurrencyService = require('../services/CurrencyService');

class CurrencyController {
  async getSupportedCurrencies(req, res) {
    try {
      const currencies = CurrencyService.getSupportedCurrencies();
      res.json({ success: true, currencies });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExchangeRates(req, res) {
    try {
      const rates = await CurrencyService.getCachedRates();
      res.json({ success: true, base: 'KES', rates });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async convertAmount(req, res) {
    try {
      const { from = 'KES', to = 'KES', amount } = req.query;
      if (!amount) {
        return res.status(400).json({ success: false, message: 'Amount query parameter is required' });
      }

      const converted = await CurrencyService.convert(Number(amount), from, to);
      res.json({ success: true, from: from.toUpperCase(), to: to.toUpperCase(), amount: Number(amount), converted });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CurrencyController();
