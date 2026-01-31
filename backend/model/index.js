const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// Function to create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
      port: config.port || 3306
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`✓ Database '${config.database}' is ready`);
    
    await connection.end();
  } catch (error) {
    console.error('✗ Error creating database:', error.message);
    throw error;
  }
};

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    // First create database if needed
    await createDatabaseIfNotExists();
    
    // Then test the connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
  } catch (error) {
    console.error('✗ Unable to connect to database:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;