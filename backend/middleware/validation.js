const Joi = require('joi');

const validateSupplier = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Supplier name is required',
      'string.min': 'Supplier name must be at least 2 characters',
      'string.max': 'Supplier name cannot exceed 255 characters',
      'any.required': 'Supplier name is required'
    }),
    city: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 100 characters',
      'any.required': 'City is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

const validateInventory = (req, res, next) => {
  const schema = Joi.object({
    supplier_id: Joi.number().integer().positive().required().messages({
      'number.base': 'Supplier ID must be a number',
      'number.integer': 'Supplier ID must be an integer',
      'number.positive': 'Supplier ID must be positive',
      'any.required': 'Supplier ID is required'
    }),
    product_name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 255 characters',
      'any.required': 'Product name is required'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be greater than or equal to 0',
      'any.required': 'Quantity is required'
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than 0',
      'any.required': 'Price is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateSupplier,
  validateInventory
};