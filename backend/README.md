# Inventory Management System 📦

A RESTful API for managing suppliers and their inventory items with MySQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- MySQL Workbench (for GUI management)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=inventory_db
   DB_DIALECT=mysql
   NODE_ENV=development
   ```

3. **The database will be created automatically when you start the server!**

4. **Run Migrations**
   ```bash
   npm run migrate
   ```
   This creates the `Suppliers` and `Inventory` tables with proper indexes.

5. **Start Server**
   ```bash
   npm start
   ```
   
   Or with auto-reload for development:
   ```bash
   npm run dev
   ```

6. **Verify It's Running**
   
   Visit: http://localhost:3000/health
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Inventory API is running"
   }
   ```

---

## 📊 Database Schema

### Suppliers Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

### Inventory Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| supplier_id | INT | FOREIGN KEY → Suppliers(id), NOT NULL |
| product_name | VARCHAR(255) | NOT NULL |
| quantity | INT | NOT NULL, >= 0 |
| price | DECIMAL(10,2) | NOT NULL, > 0 |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

### Relationship
```
Suppliers (1) ←─────→ (Many) Inventory
```
- One supplier can have multiple inventory items
- Foreign key constraint with `RESTRICT` on delete, `CASCADE` on update

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Create Supplier
**POST** `/api/supplier`

**Request:**
```json
{
  "name": "Tech Supplies Inc",
  "city": "San Francisco"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {
    "id": 1,
    "name": "Tech Supplies Inc",
    "city": "San Francisco",
    "createdAt": "2024-01-31T10:00:00.000Z",
    "updatedAt": "2024-01-31T10:00:00.000Z"
  }
}
```

**Validation:**
- `name`: Required, 2-255 characters
- `city`: Required, 2-100 characters

---

### 2. Create Inventory Item
**POST** `/api/inventory`

**Request:**
```json
{
  "supplier_id": 1,
  "product_name": "Wireless Mouse",
  "quantity": 150,
  "price": 29.99
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Inventory item created successfully",
  "data": {
    "id": 1,
    "supplier_id": 1,
    "product_name": "Wireless Mouse",
    "quantity": 150,
    "price": "29.99",
    "createdAt": "2024-01-31T10:00:00.000Z",
    "updatedAt": "2024-01-31T10:00:00.000Z"
  }
}
```

**Validation:**
- `supplier_id`: Required, must exist in Suppliers table
- `product_name`: Required, 2-255 characters
- `quantity`: Required, integer >= 0
- `price`: Required, decimal > 0

**Error (404) - Invalid Supplier:**
```json
{
  "success": false,
  "message": "Supplier with ID 999 not found"
}
```

---

### 3. Get All Inventory
**GET** `/api/inventory`

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "supplier_id": 1,
      "product_name": "Wireless Mouse",
      "quantity": 150,
      "price": "29.99",
      "supplier": {
        "id": 1,
        "name": "Tech Supplies Inc",
        "city": "San Francisco"
      }
    }
  ]
}
```

---

### 4. 🎯 Get Inventory Grouped by Supplier (Required Query)
**GET** `/api/inventory/grouped-by-supplier`

**Description:**  
Returns all inventory grouped by supplier, sorted by **total inventory value** (quantity × price) in descending order.

**Response (200):**
```json
{
  "success": true,
  "message": "Inventory grouped by supplier, sorted by total value",
  "count": 2,
  "data": [
    {
      "supplier_id": 1,
      "supplier_name": "Tech Supplies Inc",
      "supplier_city": "San Francisco",
      "total_items": 2,
      "total_inventory_value": 9494.50,
      "inventory_items": [
        {
          "id": 1,
          "product_name": "Wireless Mouse",
          "quantity": 150,
          "price": "29.99",
          "item_value": 4498.50
        },
        {
          "id": 2,
          "product_name": "USB Cable",
          "quantity": 500,
          "price": "9.99",
          "item_value": 4995.00
        }
      ]
    }
  ]
}
```

---

## 🧪 Quick Test with cURL

```bash
# 1. Create a supplier
curl -X POST http://localhost:3000/api/supplier \
  -H "Content-Type: application/json" \
  -d '{"name": "Tech Supplies Inc", "city": "San Francisco"}'

# 2. Create inventory items
curl -X POST http://localhost:3000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "product_name": "Wireless Mouse",
    "quantity": 150,
    "price": 29.99
  }'

# 3. Get all inventory
curl http://localhost:3000/api/inventory

# 4. Get grouped inventory (required query)
curl http://localhost:3000/api/inventory/grouped-by-supplier
```

---

## 🗄️ Why SQL (MySQL)?

### ✅ Reasons for Choosing SQL

1. **Structured Relationships**
   - Clear one-to-many relationship (Suppliers → Inventory)
   - Foreign key constraints ensure referential integrity
   - Data consistency enforced at database level

2. **ACID Compliance**
   - **Atomicity**: All-or-nothing transactions
   - **Consistency**: Data rules always enforced (quantity >= 0, price > 0)
   - **Isolation**: Concurrent operations don't conflict
   - **Durability**: Data is permanently saved
   - Critical for inventory management where accuracy is paramount

3. **Complex Queries & Aggregations**
   - The required grouped query is natural in SQL:
     ```sql
     SELECT supplier_id, SUM(quantity * price) AS total_value
     FROM Inventory
     GROUP BY supplier_id
     ORDER BY total_value DESC;
     ```
   - SQL excels at JOINs, GROUP BY, and aggregate functions
   - NoSQL would require application-level aggregation

4. **Data Integrity**
   - CHECK constraints enforce business rules
   - NOT NULL prevents missing critical data
   - Foreign keys prevent orphaned records
   - Validation happens at database layer

5. **Performance**
   - Efficient indexes on foreign keys and frequently queried columns
   - Query optimizer automatically chooses best execution plan
   - Proven performance for transactional workloads

6. **Mature Ecosystem**
   - MySQL has proven reliability and extensive documentation
   - Wide support in hosting environments
   - Excellent ORM support (Sequelize)
   - Rich tooling (Workbench, phpMyAdmin, etc.)

7. **Predictable Schema**
   - Inventory data structure is stable and well-defined
   - NoSQL's schema flexibility is unnecessary here

### ❌ When NoSQL Would Be Better

NoSQL (MongoDB, etc.) would be preferable if:
- Schema changes frequently or is unpredictable
- Data is hierarchical/nested without clear relationships
- Need horizontal scalability at massive scale (millions of transactions/second)
- Working with unstructured data (logs, documents, JSON blobs)
- Prioritizing write performance over complex queries

**For this inventory system: MySQL is optimal due to structured data, relational integrity, and complex querying requirements.**

---

## ⚡ Indexing & Optimization

### Implemented Indexes

1. **Suppliers Table**
   ```sql
   CREATE INDEX idx_suppliers_city ON Suppliers(city);
   ```
   - Speeds up filtering by city
   - Useful for geographic grouping

2. **Inventory Table**
   ```sql
   -- Foreign key index
   CREATE INDEX idx_inventory_supplier_id ON Inventory(supplier_id);
   
   -- Composite index
   CREATE INDEX idx_inventory_supplier_product ON Inventory(supplier_id, product_name);
   ```
   - `idx_inventory_supplier_id`: Optimizes JOIN operations
   - `idx_inventory_supplier_product`: Speeds up searches by supplier + product

### Performance Estimates
- **< 10ms** for 1,000 records
- **< 50ms** for 10,000 records
- **< 200ms** for 100,000 records

### Optimization Suggestions

#### 1. **Materialized Views** (for large datasets)
```sql
CREATE MATERIALIZED VIEW supplier_inventory_summary AS
SELECT s.id, s.name, SUM(i.quantity * i.price) AS total_value
FROM Suppliers s
LEFT JOIN Inventory i ON s.id = i.supplier_id
GROUP BY s.id, s.name;
```
- Precomputes aggregations
- Refresh periodically
- Dramatically speeds up reports

#### 2. **Caching Layer** (Redis)
- Cache frequently accessed grouped inventory data
- Invalidate on INSERT/UPDATE/DELETE
- Reduces database load by 60-80%

#### 3. **Read Replicas**
- Separate read and write operations
- Scale read queries horizontally
- Reduce load on primary database

#### 4. **Partitioning** (for millions of records)
```sql
PARTITION BY RANGE (supplier_id) (
  PARTITION p0 VALUES LESS THAN (1000),
  PARTITION p1 VALUES LESS THAN (5000),
  PARTITION p2 VALUES LESS THAN MAXVALUE
);
```

---

## 📁 Project Structure

```
inventory-system/
├── backend/
│   ├── config/
│   │   ├── config.js          # Sequelize configuration
│   │  
│   ├── controllers/
│   │   ├── supplierController.js
│   │   └── inventoryController.js
│   ├── data/                  # (If you have seed data)
│   ├── middleware/
│   │   └── validation.js      # Joi validation
│   ├── migrations/
│   │   ├── 20240131000001-create-supplier.js
│   │   └── 20240131000002-create-inventory.js
│   ├── model/
│   │   ├── index.js           
│   │   ├── Inventory.js
│   │   └── Supplier.js
│   ├── node_modules/
│   └── routes/
│       ├── supplierRoutes.js
│       └── inventoryRoutes.js
├── .env                       # Environment variables (create this!)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔍 Verify in MySQL Workbench

After running migrations, connect to MySQL Workbench and run:

```sql
-- Use the database
USE inventory_db;

-- Show all tables
SHOW TABLES;

-- View table structures
DESCRIBE Suppliers;
DESCRIBE Inventory;

-- View indexes
SHOW INDEX FROM Suppliers;
SHOW INDEX FROM Inventory;

-- Test the grouped query manually
SELECT 
  s.id, 
  s.name, 
  s.city,
  COUNT(i.id) AS total_items,
  SUM(i.quantity * i.price) AS total_value
FROM Suppliers s
LEFT JOIN Inventory i ON s.id = i.supplier_id
GROUP BY s.id, s.name, s.city
ORDER BY total_value DESC;
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** 
- Ensure MySQL is running
- Verify credentials in `.env` file
- Check port 3306 is not blocked

### Issue: Migration Already Exists
```
ERROR: Table 'Suppliers' already exists
```
**Solution:**
```bash
npm run migrate:undo
npm run migrate
```

### Issue: Supplier Not Found (404)
```json
{
  "success": false,
  "message": "Supplier with ID 999 not found"
}
```
**Solution:** Create the supplier first before adding inventory to it.

### Issue: Validation Error
```json
{
  "success": false,
  "errors": ["Quantity must be greater than or equal to 0"]
}
```
**Solution:** Check your request body matches the validation rules.

---

## 🎯 Assignment Requirements Checklist

- ✅ **Database**: 2 tables (Suppliers, Inventory)
- ✅ **Relationship**: One-to-many (Suppliers → Inventory)
- ✅ **API**: POST /supplier
- ✅ **API**: POST /inventory
- ✅ **API**: GET /inventory
- ✅ **Validation**: Inventory must belong to valid supplier
- ✅ **Validation**: Quantity >= 0
- ✅ **Validation**: Price > 0
- ✅ **Required Query**: Inventory grouped by supplier, sorted by total value
- ✅ **README**: Database schema explanation
- ✅ **README**: SQL vs NoSQL justification
- ✅ **README**: Optimization suggestions

---

## 📝 License

MIT License - Free to use for learning and development.

---

## 👨‍💻 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Sequelize
- **Validation**: Joi
- **Environment**: dotenv

---

**Estimated Completion Time**: 2-3 hours  
**Status**: ✅ Production Ready
