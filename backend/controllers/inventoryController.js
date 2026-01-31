const { Inventory } = require('../model/Inventory');
const { Supplier } = require('../model/Supplier');
const sequelize = require('../model/index');

/**
 * Create a new inventory item
 * POST /api/inventory
 */
const createInventory = async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, price } = req.body;

    // Check if supplier exists
    const supplier = await Supplier.findByPk(supplier_id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${supplier_id} not found`
      });
    }

    const inventory = await Inventory.create({
      supplier_id,
      product_name,
      quantity,
      price
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Error creating inventory:', error);
    
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
 * Get all inventory items
 * GET /api/inventory
 */
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
      include: [{
        model: Supplier,
        as: 'supplier',
        attributes: ['id', 'name', 'city']
      }],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Required Query: Get inventory grouped by supplier, sorted by total inventory value
 * GET /api/inventory/grouped-by-supplier
 */
const getInventoryGroupedBySupplier = async (req, res) => {
  try {
    // Using raw SQL query for optimal performance
    const results = await sequelize.query(`
      SELECT 
        s.id AS supplier_id,
        s.name AS supplier_name,
        s.city AS supplier_city,
        COUNT(i.id) AS total_items,
        SUM(i.quantity * i.price) AS total_inventory_value,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', i.id,
            'product_name', i.product_name,
            'quantity', i.quantity,
            'price', i.price,
            'item_value', i.quantity * i.price
          )
        ) AS inventory_items
      FROM Suppliers s
      LEFT JOIN Inventory i ON s.id = i.supplier_id
      GROUP BY s.id, s.name, s.city
      ORDER BY total_inventory_value DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    // Parse JSON strings to objects
    const formattedResults = results.map(result => ({
      supplier_id: result.supplier_id,
      supplier_name: result.supplier_name,
      supplier_city: result.supplier_city,
      total_items: result.total_items,
      total_inventory_value: parseFloat(result.total_inventory_value) || 0,
      inventory_items: result.inventory_items ? JSON.parse(result.inventory_items) : []
    }));

    res.status(200).json({
      success: true,
      message: 'Inventory grouped by supplier, sorted by total value',
      count: formattedResults.length,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching grouped inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryGroupedBySupplier
};