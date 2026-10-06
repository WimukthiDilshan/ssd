const express = require("express");
const userController = require("../controller/UserController");
const { authenticateUser, authorizeRole } = require('../middleware/AuthMiddleware');

const router = express.Router();

// Public Routes
router.post("/register", userController.createUser); // Create User
router.post("/login", userController.login); // Login User
router.post("/logout", userController.logout); // Logout User
router.post("/forget-password", userController.forgetPassword); // Forget Password
router.post("/verify-code", userController.verifyCode); // Verify Code
router.post("/reset-password", userController.resetPassword); // Reset Password

// Protected Routes
router.get("/users", authenticateUser, authorizeRole(['admin', 'manager']), userController.getUsers);
router.get("/users/role/:role", authenticateUser, authorizeRole(['admin', 'manager']), userController.getUsersByRole);
router.get("/users/:id", authenticateUser, userController.getUserById);
router.put("/users/:id", authenticateUser, userController.updateUser);
router.put("/users/:id/role", authenticateUser, authorizeRole(['admin', 'manager']), userController.updateUserRole);
router.delete("/users/:id", authenticateUser, authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
