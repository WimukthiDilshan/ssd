const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/AuthMiddleware");
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const {
    createProductionLog,
    getAllProductionLogs,
    getProductionLogById,
    getProductionLogsByProduct,
    getProductionLogsByInventoryRelease,
    getProductStock
} = require("../controller/ProductionLogController");

// Create new production log (Manager and Admin only)
router.post("/", ...writeInventory, createProductionLog);

// Get all production logs (Authenticated users only)
router.get("/", ...readInventory, getAllProductionLogs);

// Get production logs by product ID (Authenticated users only)
router.get("/product/:productId", ...readInventory, getProductionLogsByProduct);

// Get production logs by inventory release ID (Authenticated users only)
router.get("/inventory-release/:inventoryReleaseId", ...readInventory, getProductionLogsByInventoryRelease);

// Get production log by ID (Authenticated users only)
router.get("/:productionId", ...readInventory, getProductionLogById);

// Get current stock for a product (Authenticated users only)
router.get("/stock/:productId", ...readInventory, getProductStock);

module.exports = router;
