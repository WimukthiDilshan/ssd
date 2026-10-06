const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/AuthMiddleware");
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const {
    createStock,
    getAllStock,
    getStockById,
    getStockByItemId,
    getTotalStockByItemId,
    updateStock,
    deleteStock,
    getStockAnalytics
} = require("../controller/InventoryStockController");

// Create new stock entry (Manager and Admin only)
router.post("/", ...writeInventory, createStock);

// Get all stock entries
router.get("/", ...readInventory, getAllStock);

// Get stock analytics
router.get("/analytics", ...readInventory, getStockAnalytics);

// Get total available stock for an item
router.get("/total/:itemId", ...readInventory, getTotalStockByItemId);

// Get stock entries by item ID
router.get("/item/:itemId", ...readInventory, getStockByItemId);

// Get stock entry by ID
router.get("/:stockId", ...readInventory, getStockById);

// Update stock quantity (Manager and Admin only)
router.put("/:stockId", ...writeInventory, updateStock);

// Delete stock entry (Manager and Admin only)
router.delete("/:stockId", ...writeInventory, deleteStock);

module.exports = router; 
