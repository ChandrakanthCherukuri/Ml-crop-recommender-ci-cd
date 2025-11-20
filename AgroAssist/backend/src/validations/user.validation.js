import Joi from "joi";
export const userValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
  role: Joi.string().valid("admin", "farmer", "agronomist").default("farmer"),
});

