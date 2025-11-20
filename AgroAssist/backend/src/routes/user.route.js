import express from "express";
import { validateUser } from "../middlewares/validations.js";
import {
  getUsers,
  loginUser,
  profile,
  registerUser,
} from "../controllers/user.controller.js";
import { authorizeRoles, protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user (Farmer, Agronomist, or Admin)
 * @access  Public
 */
router.post("/register", validateUser, registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile details
 * @access  Authenticated users (Farmer, Agronomist, Admin)
 */
router.get("/me", protectRoute, profile);

/**
 * @route   GET /api/users
 * @desc    Get all users in the system
 * @access  Admin only
 */
router.get("/users", protectRoute, authorizeRoles("admin"), getUsers);

export default router;
