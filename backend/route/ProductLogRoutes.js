const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/AuthMiddleware');
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const ProductLogController = require('../controller/ProductLogController');

// Create a new production log
router.post('/', ...writeInventory, ProductLogController.create);

// Get all production logs
router.get('/', ...readInventory, ProductLogController.getAll);

// Get product stock summary
router.get('/stock/summary', ...readInventory, ProductLogController.getProductStock);

// Get a single production log by ID
router.get('/:id', ...readInventory, ProductLogController.getById);

// Update a production log
router.put('/:id', ...writeInventory, ProductLogController.update);

// Delete a production log
router.delete('/:id', ...writeInventory, ProductLogController.delete);

module.exports = router; 
