import express from "express";
import cors from "cors";
import dotenv from "@dotenvx/dotenvx";
import { connectDB } from "./config/db.js";
import apis from "./apis/apis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB(process.env.MONGO_URI);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.urlencoded());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to AgroAssist API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      sensors: '/api/sensor',
      assignments: '/api/assign',
      ml: '/api/ml'
    },
    frontend: 'http://localhost:5173',
    docs: 'API documentation available at /api/docs'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'agroassist-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

apis(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
