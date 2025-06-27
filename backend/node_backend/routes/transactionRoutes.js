const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');

// Route to process a new transaction and get a fraud prediction
router.post('/process-transaction', transactionController.processTransaction);

// Route to update the status of a transaction (e.g., from 'pending' to 'clean' or 'fraud')
router.post('/status', transactionController.updateTransactionStatus);

// Route to get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Route to get a specific transaction by its ID, along with the customer's history
router.get('/transaction/:id', transactionController.getTransactionById);

module.exports = router;