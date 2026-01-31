const express = require('express');
const router = express.Router();
const { validateInventory } = require('../middleware/validation');
const { 
  createInventory, 
  getAllInventory, 
  getInventoryGroupedBySupplier 
} = require('../controllers/inventoryController');

/**
 * @route   POST /api/inventory
 * @desc    Create a new inventory item
 * @access  Public
 */
router.post('/', validateInventory, createInventory);

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items with supplier details
 * @access  Public
 */
router.get('/', getAllInventory);

/**
 * @route   GET /api/inventory/grouped-by-supplier
 * @desc    Get inventory grouped by supplier, sorted by total inventory value
 * @access  Public
 * @note    Required query for assignment
 */
router.get('/grouped-by-supplier', getInventoryGroupedBySupplier);

module.exports = router;