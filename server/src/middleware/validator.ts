import Joi from "joi";
// Define a Joi schema for validation (for user input)
const passwordSchema = Joi.string()
  .min(6)
  // .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
  .required()
  .messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
    "string.empty": "Password is not allowed to be empty",
    "string.base": "Password must be a string",
    // "string.pattern.base":
    //   "Password must contain at least one letter and one number",
  });

const emailSchema = Joi.string().email().required().messages({
  "string.email": "Email must be a valid email address",
  "any.required": "Email is required",
});

const verificationCodeSchema = Joi.string()
  .length(5)
  .pattern(/^\d+$/)
  .required()
  .messages({
    "string.length": "Verification code must be 5 digits",
    "string.pattern.base": "Verification code must contain only numbers",
    "any.required": "Verification code is required",
  });

// Validation schemas for different operations
const validateAuthFields = Joi.object({
  password: passwordSchema,
  email: emailSchema,
});

const validateVerificationRequest = Joi.object({
  email: emailSchema,
});

const validateVerificationCode = Joi.object({
  email: emailSchema,
  verificationCode: verificationCodeSchema,
});

const validateChangePassword = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema.not(Joi.ref("oldPassword")).messages({
    "any.invalid": "New password must be different from old password",
  }),
});

const validateForgotPasswordRequest = Joi.object({
  email: emailSchema,
});

const validateResetPassword = Joi.object({
  email: emailSchema,
  resetCode: verificationCodeSchema,
  newPassword: passwordSchema,
});

// Validation function
const validateRequest = (schema: Joi.ObjectSchema, data: object) => {
  return schema.validate(data, { abortEarly: false });
};

export {
  validateAuthFields,
  validateVerificationRequest,
  validateVerificationCode,
  validateChangePassword,
  validateForgotPasswordRequest,
  validateResetPassword,
  validateRequest,
};
