const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty'
      },
      len: {
        args: [2, 255],
        msg: 'Product name must be between 2 and 255 characters'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Quantity must be greater than or equal to 0'
      },
      isInt: {
        msg: 'Quantity must be an integer'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Price must be greater than 0'
      },
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      }
    }
  }
}, {
  tableName: 'Inventory',
  timestamps: true
});

module.exports = Inventory;