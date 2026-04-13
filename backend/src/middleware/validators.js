import Joi from "joi";

const passwordSchema = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
  .messages({
    "string.pattern.base":
      "Password must include uppercase, lowercase, number, and special character",
  });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: passwordSchema.required(),
});

export const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  ISBN: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(0).required(),
});

export const studentSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).required(),
  enrollmentNumber: Joi.string().trim().required(),
});

export const issueSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24).required(),
});

export const returnSchema = Joi.object({
  issueId: Joi.string().hex().length(24).required(),
});
