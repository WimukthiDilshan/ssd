const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/AuthMiddleware');
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const ProductInventoryRelease = require('../controller/ProductInventoryRelease');

// Create a new production inventory release
router.post('/', ...writeInventory, ProductInventoryRelease.create);

// Get all production inventory releases
router.get('/', ...readInventory, ProductInventoryRelease.getAll);

// Get a single production inventory release by ID
router.get('/:id', ...readInventory, ProductInventoryRelease.getById);

// Delete a production inventory release and restore inventory
router.delete('/:id', ...writeInventory, ProductInventoryRelease.delete);

module.exports = router; 
