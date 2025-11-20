import mongoose from "mongoose";
import { userValidationSchema } from "../validations/user.validation.js";
import sensorDataValidationSchema from "../validations/sensorData.validation.js";
import assignValidationSchema from "../validations/assign.validation.js";

const createValidationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ 
      message: errors[0], // Send first error as main message
      errors: errors // Send all errors in array
    });
  }
  next();
};

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};

export const validateUser = createValidationMiddleware(userValidationSchema);
export const validateSensorData = createValidationMiddleware(sensorDataValidationSchema);
export const validateAssignment = createValidationMiddleware(assignValidationSchema);