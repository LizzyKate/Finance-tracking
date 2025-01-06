import Joi from "joi";
// Define a Joi schema for validation (for user input)
const joiSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    // .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z)(?.*d).{8,}$"))
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
});

// Function to validate data using Joi before saving it to MongoDB
export const validateUser = (userData: object) => {
  return joiSchema.validate(userData, { abortEarly: false }); // abortEarly: false to get all error messages at once
};
