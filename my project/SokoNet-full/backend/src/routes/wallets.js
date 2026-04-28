/**
 * Wallet Routes
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, walletController.getWallet);
router.post('/deposit', authMiddleware, walletController.deposit);
router.post('/release', authMiddleware, walletController.releasePending);
router.post('/withdraw', authMiddleware, walletController.withdraw);

module.exports = router;
