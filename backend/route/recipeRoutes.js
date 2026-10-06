const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/AuthMiddleware');
const canManageRecipes = [authenticateUser, authorizeRole(['admin', 'manager'])];
const {
    getAllRecipes,
    getRecipeByProductId,
    createRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controller/recipeController');

// Get all recipes
router.get('/', ...canManageRecipes, getAllRecipes);

// Get recipe by product ID
router.get('/product/:productId', ...canManageRecipes, getRecipeByProductId);

// Create new recipe
router.post('/', ...canManageRecipes, createRecipe);

// Update recipe
router.put('/:product_item_id/:ingredient_item_id', ...canManageRecipes, updateRecipe);

// Delete recipe
router.delete('/:product_item_id/:ingredient_item_id', ...canManageRecipes, deleteRecipe);

module.exports = router; 
