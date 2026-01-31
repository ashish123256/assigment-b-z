const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Supplier name cannot be empty'
      },
      len: {
        args: [2, 255],
        msg: 'Supplier name must be between 2 and 255 characters'
      }
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'City cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'City must be between 2 and 100 characters'
      }
    }
  }
}, {
  tableName: 'Suppliers',
  timestamps: true
});

module.exports = Supplier;