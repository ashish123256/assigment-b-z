const express = require('express');
const router = express.Router();
const { validateSupplier } = require('../middleware/validation');
const { createSupplier, getAllSuppliers } = require('../controllers/supplierController');

/**
 * @route   POST /api/supplier
 * @desc    Create a new supplier
 * @access  Public
 */
router.post('/', validateSupplier, createSupplier);

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers with their inventory
 * @access  Public
 */
router.get('/', getAllSuppliers);

module.exports = router;