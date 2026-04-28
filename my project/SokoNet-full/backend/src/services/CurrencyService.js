/**
 * Currency Service
 * Provides multi-currency support and conversion using cached exchange rates.
 */

const ExchangeRate = require('../models/ExchangeRate');

const SUPPORTED_CURRENCIES = ['KES', 'UGX', 'TZS', 'RWF', 'BIF', 'GHS', 'NGN', 'ZAR'];
const BASE_CURRENCY = 'KES';

const STATIC_FALLBACK_RATES = {
  UGX: 37.0,
  TZS: 24.0,
  RWF: 8.5,
  BIF: 22.0,
  GHS: 0.13,
  NGN: 14.3,
  ZAR: 0.12
};

class CurrencyService {
  getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  async getCachedRates() {
    const now = new Date();
    const rates = await ExchangeRate.find({ expiresAt: { $gt: now } });

    if (rates.length === SUPPORTED_CURRENCIES.length) {
      return rates.reduce((acc, rate) => {
        acc[rate.currency] = rate.rate;
        return acc;
      }, {});
    }

    return this.fetchLatestRates();
  }

  async fetchLatestRates() {
    const symbols = SUPPORTED_CURRENCIES.filter(curr => curr !== BASE_CURRENCY).join(',');
    const url = `https://api.exchangerate.host/latest?base=${BASE_CURRENCY}&symbols=${symbols}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.rates) {
        throw new Error('Invalid exchange rate response');
      }

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const updatedRates = [];

      for (const currency of SUPPORTED_CURRENCIES) {
        if (currency === BASE_CURRENCY) {
          updatedRates.push({ currency, rate: 1, expiresAt });
          continue;
        }

        const rate = Number(data.rates[currency] ?? STATIC_FALLBACK_RATES[currency] ?? 1);
        updatedRates.push({ currency, rate, expiresAt });
      }

      await Promise.all(updatedRates.map(entry =>
        ExchangeRate.findOneAndUpdate(
          { currency: entry.currency },
          entry,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      ));

      return updatedRates.reduce((acc, entry) => {
        acc[entry.currency] = entry.rate;
        return acc;
      }, {});
    } catch (error) {
      console.warn('CurrencyService.fetchLatestRates fallback:', error.message);

      const fallbackRates = {
        [BASE_CURRENCY]: 1,
        ...STATIC_FALLBACK_RATES
      };

      await Promise.all(Object.entries(fallbackRates).map(([currency, rate]) =>
        ExchangeRate.findOneAndUpdate(
          { currency },
          { currency, rate, source: 'fallback', expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      ));

      return fallbackRates;
    }
  }

  async convert(amount, fromCurrency, toCurrency) {
    const normalizedFrom = fromCurrency.toUpperCase();
    const normalizedTo = toCurrency.toUpperCase();

    if (!SUPPORTED_CURRENCIES.includes(normalizedFrom) || !SUPPORTED_CURRENCIES.includes(normalizedTo)) {
      throw new Error(`Unsupported currency. Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`);
    }

    if (normalizedFrom === normalizedTo) {
      return Number(amount);
    }

    const rates = await this.getCachedRates();
    const fromRate = rates[normalizedFrom] ?? (normalizedFrom === BASE_CURRENCY ? 1 : STATIC_FALLBACK_RATES[normalizedFrom]);
    const toRate = rates[normalizedTo] ?? (normalizedTo === BASE_CURRENCY ? 1 : STATIC_FALLBACK_RATES[normalizedTo]);

    const amountInBase = Number(amount) / fromRate;
    return Number((amountInBase * toRate).toFixed(2));
  }
}

module.exports = new CurrencyService();
