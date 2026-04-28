/**
 * Currency Routes
 */

const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.get('/supported', currencyController.getSupportedCurrencies);
router.get('/rates', currencyController.getExchangeRates);
router.get('/convert', currencyController.convertAmount);

module.exports = router;
