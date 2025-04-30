// const Joi = require("joi");
// const Joi = import('joi');
import Joi from 'joi';

const passwordSchema = Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
    .required();

export const registerSchema = Joi.object({
  // firstName: Joi.string().required(),
  // lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: passwordSchema,
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  type: Joi.string().valid("user", "admin").required()
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: passwordSchema
}).unknown(false);

export const usernameExistsSchema = Joi.object({
  username: Joi.string().required(),
}).unknown(false);