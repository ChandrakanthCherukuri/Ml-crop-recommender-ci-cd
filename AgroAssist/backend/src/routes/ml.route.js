import express from "express";
import { protectRoute, authorizeRoles } from "../middlewares/protectRoute.js";
import multer from "multer";
import { cropRecommendation, diseaseDetection, getPredictionHistory } from "../controllers/ml.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store uploaded image in memory

// Crop Recommendation
router.post("/crop-recommend", protectRoute, authorizeRoles("farmer", "agronomist"), cropRecommendation);

// Disease Detection (upload image)
router.post("/disease-detect", protectRoute, authorizeRoles("farmer", "agronomist"), upload.single("file"), diseaseDetection);

// Prediction history
router.get("/history", protectRoute, authorizeRoles("farmer", "agronomist"), getPredictionHistory);

export default router;
