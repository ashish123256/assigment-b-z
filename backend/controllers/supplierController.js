const {  Inventory } = require('../model/Inventory');
const { Supplier } = require('../model/Supplier');

/**
 * Create a new supplier
 * POST /api/supplier
 */
const createSupplier = async (req, res) => {
  try {
    const { name, city } = req.body;

    const supplier = await Supplier.create({
      name,
      city
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all suppliers with their inventory
 * GET /api/suppliers (optional endpoint for viewing suppliers)
 */
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [{
        model: Inventory,
        as: 'inventory',
        attributes: ['id', 'product_name', 'quantity', 'price']
      }],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers
};