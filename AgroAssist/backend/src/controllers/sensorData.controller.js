import SensorData from "../models/sensorData.model.js";
import Assignment from "../models/assign.model.js";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";

// 1️⃣ Add sensor data
export const addSensorData = async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall, label } = req.body;
  const farmer = req.user.id; // Get farmer ID from authenticated user

  try {
    const sensorData = new SensorData({ 
      farmer, 
      N, 
      P, 
      K, 
      temperature, 
      humidity, 
      ph, 
      rainfall, 
      label 
    });
    await sensorData.save();

    res.status(201).json({ 
      message: "Sensor data added successfully", 
      data: sensorData 
    });
  } catch (error) {
    logger.error("addSensorData Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2️⃣ Get latest sensor data for a farmer
export const getLatestSensorData = async (req, res) => {
  const farmerId = req.user.id; // Get from authenticated user

  try {
    const data = await SensorData.findOne({ farmer: farmerId }).sort({ createdAt: -1 });
    res.status(200).json({ data: data || null });
  } catch (error) {
    logger.error("getLatestSensorData Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3️⃣ Get all sensor data for a farmer
export const getAllSensorData = async (req, res) => {
  const farmerId = req.user.id; // Get from authenticated user

  try {
    const data = await SensorData.find({ farmer: farmerId }).sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (error) {
    logger.error("getAllSensorData Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4️⃣ Get all sensor data (Admin only)
export const getAllSensorDataAdmin = async (req, res) => {
  try {
    const data = await SensorData.find().populate("farmer", "name email").sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (error) {
    logger.error("getAllSensorDataAdmin Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
