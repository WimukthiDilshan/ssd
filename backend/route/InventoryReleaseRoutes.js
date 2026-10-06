const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/AuthMiddleware");
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const {
    createInventoryRelease,
    getAllInventoryReleases,
    getInventoryReleaseById,
    getInventoryReleasesByOrder,
    updateInventoryRelease,
    deleteInventoryRelease
} = require("../controller/InventoryReleaseController");

// Create new inventory release (Manager and Admin only)
router.post("/", ...writeInventory, createInventoryRelease);

// Get all inventory releases
router.get("/", ...readInventory, getAllInventoryReleases);

// Get inventory releases by order ID
router.get("/order/:orderId", ...readInventory, getInventoryReleasesByOrder);

// Get inventory release by ID
router.get("/:releaseId", ...readInventory, getInventoryReleaseById);

// Update inventory release (Manager and Admin only)
router.put("/:releaseId", ...writeInventory, updateInventoryRelease);

// Delete inventory release (Manager and Admin only)
router.delete("/:releaseId", ...writeInventory, deleteInventoryRelease);

module.exports = router; 
