import Joi from "joi";
import { objectId } from "./objectId.js";

const sensorDataValidationSchema = Joi.object({
  farmer: objectId.optional().messages({
    "any.invalid": "Invalid Farmer ID",
  }),
  N: Joi.number().required().messages({
    "any.required": "Nitrogen (N) is required",
    "number.base": "Nitrogen (N) must be a number",
  }),
  P: Joi.number().required().messages({
    "any.required": "Phosphorus (P) is required",
    "number.base": "Phosphorus (P) must be a number",
  }),
  K: Joi.number().required().messages({
    "any.required": "Potassium (K) is required",
    "number.base": "Potassium (K) must be a number",
  }),
  temperature: Joi.number().required().messages({
    "any.required": "Temperature is required",
    "number.base": "Temperature must be a number",
  }),
  humidity: Joi.number().required().messages({
    "any.required": "Humidity is required",
    "number.base": "Humidity must be a number",
  }),
  ph: Joi.number().required().messages({
    "any.required": "pH level is required",
    "number.base": "pH level must be a number",
  }),
  rainfall: Joi.number().required().messages({
    "any.required": "Rainfall is required",
    "number.base": "Rainfall must be a number",
  }),
  label: Joi.string().optional(),
});

export default sensorDataValidationSchema;
