import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authUser = await User.findById(decoded.id);
    if (!authUser) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: authUser._id, role: authUser.role };
    next();
  } catch (error) {
    logger.error(`Auth Middleware Error: ${error.message}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }
    next();
  };
};