const express = require("express");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
} = require("../utils/validators/auth");
const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginContoller");
const promptController = require("../controllers/PromptController");
const { verifyToken } = require("../middlewares/auth");
const userController = require("../controllers/UserController");
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
// register
router.post(
  "/auth/register",
  validateRegister,
  registerController.registerController
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 */
// login
router.post("/auth/login", validateLogin, loginController.loginController);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot Password (Reset Password)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
// forgot password
router.post(
  "/auth/forgot-password",
  validateForgotPassword,
  userController.forgotPassword
);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
// get profile
router.get("/profile", verifyToken, userController.getProfileUser);

/**
 * @swagger
 * /recipe/generate:
 *   post:
 *     summary: Generate a recipe using AI
 *     tags: [Recipe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - ingredients
 *               - category
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 enum: [Makanan Berat, Makanan Sehat, Makanan Bayi]
 *               adjustment:
 *                 type: string
 *               calorieLimit:
 *                 type: integer
 *               spicyLevel:
 *                 type: integer
 *               avoidFoods:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe generated successfully
 */
// Generate Recipe
router.post("/recipe/generate", verifyToken, promptController.generateRecipe);

module.exports = router;
