const Joi = require("joi");

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: passwordSchema,
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  type: Joi.string().valid("user", "admin").required()
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema
}).unknown(false);

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  .required();

