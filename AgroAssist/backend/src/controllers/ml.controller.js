import axios from "axios";
import FormData from "form-data";
import MLPrediction from "../models/mlPrediction.models.js";
import logger from "../utils/logger.js";

export const cropRecommendation = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    const farmerId = req.user.id;

    const validateInput = (data) => {
      const required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
      const missing = required.filter(field => data[field] === undefined || data[field] === null);
      
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }

      const ranges = {
        N: [0, 300], P: [0, 150], K: [0, 250],
        temperature: [-10, 50], humidity: [0, 100],
        ph: [3, 10], rainfall: [0, 500]
      };

      for (const [field, [min, max]] of Object.entries(ranges)) {
        const value = data[field];
        if (value < min || value > max) {
          throw new Error(`${field} value ${value} out of valid range [${min}, ${max}]`);
        }
      }
    };

    validateInput({ N, P, K, temperature, humidity, ph, rainfall });

    const call_microservice = async () => {
      try {
        const response = await axios.post("http://localhost:5000/predict", {
          N, P, K, temperature, humidity, ph, rainfall,
        }, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        return response.data.predictions;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('ML service is unavailable');
        } else if (error.response?.status === 400) {
          throw new Error('Invalid input data for ML service');
        } else if (error.response?.status >= 500) {
          throw new Error('ML service internal error');
        }
        throw error;
      }
    };

    const output = await call_microservice();

    const existingPrediction = await MLPrediction.findOneAndUpdate(
      { 
        farmer: farmerId, 
        type: "crop-recommendation",
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      },
      {
        input: { N, P, K, temperature, humidity, ph, rainfall },
        output,
        python_version: "3.13.7",
        status: "success",
        updatedAt: new Date()
      },
      { 
        new: true,
        upsert: false
      }
    );

    let prediction;
    
    if (!existingPrediction) {
      prediction = new MLPrediction({
        farmer: farmerId,
        type: "crop-recommendation",
        input: { N, P, K, temperature, humidity, ph, rainfall },
        output,
        python_version: "3.13.7",
        status: "success",
      });
      
      await prediction.save();
    } else {
      prediction = existingPrediction;
    }

    const getConsensusRecommendation = (predictions) => {
      const cropScores = {};
      
      Object.entries(predictions).forEach(([model, result]) => {
        const crop = result.crop;
        const confidence = result.confidence;
        
        if (!cropScores[crop]) {
          cropScores[crop] = { totalScore: 0, count: 0 };
        }
        
        cropScores[crop].totalScore += confidence;
        cropScores[crop].count += 1;
      });
      
      let bestCrop = null;
      let bestScore = 0;
      
      Object.entries(cropScores).forEach(([crop, data]) => {
        const avgScore = data.totalScore / data.count;
        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestCrop = crop;
        }
      });
      
      return { crop: bestCrop, confidence: bestScore };
    };

    const consensus = getConsensusRecommendation(output);

    res.status(200).json({ 
      data: {
        output,
        consensus,
        predictionId: prediction._id
      }
    });

  } catch (error) {
    logger.error("cropRecommendation Error:", error.message);
    
    if (error.message.includes('Missing required fields') || 
        error.message.includes('out of valid range')) {
      return res.status(400).json({ message: error.message });
    } else if (error.message.includes('ML service')) {
      return res.status(503).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const diseaseDetection = async (req, res) => {
  try {
    const farmerId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Prepare form-data
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call Flask ML microservice on port 8000
    const flaskResponse = await axios.post(
      "http://localhost:8000/predict",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 15000
      }
    );

    const { prediction, confidence } = flaskResponse.data;

    // Save prediction to database
    const mlRecord = new MLPrediction({
      farmer: farmerId,
      type: "disease-detection",
      input: { file_name: req.file.originalname },
      output: { prediction, confidence },
      image_path: `uploads/${req.file.originalname}`,
      status: "success"
    });

    await mlRecord.save();

    res.status(200).json({ 
      prediction, 
      confidence,
      predictionId: mlRecord._id
    });

  } catch (error) {
    logger.error("diseaseDetection Error:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ message: 'Disease detection service is unavailable' });
    } else if (error.response?.status === 400) {
      return res.status(400).json({ message: 'Invalid image file' });
    }
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPredictionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let predictions;

    if (role === "farmer") {
      predictions = await MLPrediction.find({ farmer: userId }).sort({
        createdAt: -1,
      });
    } else if (role === "agronomist") {
      const Assignment = require("../models/assign.model.js").default;
      const assignment = await Assignment.findOne({ agronomist: userId });
      const farmerIds = assignment ? assignment.farmers : [];
      predictions = await MLPrediction.find({
        farmer: { $in: farmerIds },
      }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({ data: predictions });
  } catch (error) {
    logger.error("getPredictionHistory Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};