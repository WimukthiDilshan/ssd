const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/AuthMiddleware");
const readInventory = [authenticateUser, authorizeRole(['admin', 'manager', 'cashier'])];
const writeInventory = [authenticateUser, authorizeRole(['admin', 'manager'])];
const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getAllCategories,
    createCategory
} = require("../controller/InventoryItemController");

// Create new item (Manager and Admin only)
router.post("/", ...writeInventory, createItem);

// Create new category (Manager and Admin only)
router.post("/categories", ...writeInventory, createCategory);

// Get all items
router.get("/", ...readInventory, getAllItems);

// Get all categories
router.get("/categories", ...readInventory, getAllCategories);

// Get items by category
router.get("/category/:category", ...readInventory, getItemsByCategory);

// Get item by ID
router.get("/:itemId", ...readInventory, getItemById);

// Update item (Manager and Admin only)
router.put("/:itemId", ...writeInventory, updateItem);

// Delete item (Manager and Admin only)
router.delete("/:itemId", ...writeInventory, deleteItem);

module.exports = router; 
