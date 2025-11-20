import Joi from "joi";
import { objectId } from "./objectId.js";

const assignValidationSchema = Joi.object({
  agronomistId: objectId.required().messages({
    "any.required": "Agronomist ID is required",
    "any.invalid": "Invalid Agronomist ID",
  }),
  farmerIds: Joi.array()
    .items(
      objectId.messages({
        "any.invalid": "Invalid Farmer ID",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Farmers must be an array of IDs",
      "array.min": "At least one Farmer ID is required",
      "any.required": "Farmers list is required",
    }),
});

export default assignValidationSchema;
