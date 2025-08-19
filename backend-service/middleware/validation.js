const Joi = require('joi');
const { BadRequestError } = require('../utils/customErrors');

// --- Schemas ---
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid('male', 'female', 'other').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required()
});

const cartItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  product_quantity: Joi.number().integer().min(1).default(1)
});

const wishlistItemSchema = Joi.object({
  productId: Joi.string().uuid().required()
});


// --- Reusable Middleware Function ---
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  
  if (error) {
    const validationError = new BadRequestError(error.details[0].message);
    return next(validationError); 
  }
  
  next();
};


module.exports = {
    validate,
    registerSchema,
    loginSchema,
    updateProfileSchema,
    cartItemSchema,
    wishlistItemSchema
};