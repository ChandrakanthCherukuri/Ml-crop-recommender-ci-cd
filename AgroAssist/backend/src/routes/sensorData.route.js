import express from "express";
import {
  addSensorData,
  getLatestSensorData,
  getAllSensorData,
  getAllSensorDataAdmin,
} from "../controllers/sensorData.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/protectRoute.js";
import { validateSensorData } from "../middlewares/validations.js";

const router = express.Router();

/**
 * @route   POST /api/sensor/add
 * @desc    Add new sensor data for the logged-in farmer
 * @access  Farmer only
 */
router.post(
  "/add",
  protectRoute,
  authorizeRoles("farmer"),
  validateSensorData,
  addSensorData
);

/**
 * @route   GET /api/sensor/latest
 * @desc    Get latest sensor data of logged-in farmer
 * @access  Farmer (self) or Agronomist (assigned farmers)
 */
router.get(
  "/latest",
  protectRoute,
  authorizeRoles("farmer", "agronomist"),
  getLatestSensorData
);

/**
 * @route   GET /api/sensor
 * @desc    Get all sensor data of logged-in farmer
 * @access  Farmer (self) or Agronomist (assigned farmers)
 */
router.get(
  "/",
  protectRoute,
  authorizeRoles("farmer", "agronomist"),
  getAllSensorData
);

/**
 * @route   GET /api/sensor/all
 * @desc    Get all sensor data (Admin only)
 * @access  Admin
 */
router.get(
  "/all",
  protectRoute,
  authorizeRoles("admin"),
  getAllSensorDataAdmin
);

export default router;
