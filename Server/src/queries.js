// PostgreSQL query conversion utilities

// Convert MySQL queries to PostgreSQL format
const convertQuery = (mysqlQuery, params = []) => {
  // Replace MySQL ? placeholders with PostgreSQL $1, $2, etc.
  let pgQuery = mysqlQuery;
  let paramIndex = 1;
  
  // Replace ? with $1, $2, etc.
  pgQuery = pgQuery.replace(/\?/g, () => `$${paramIndex++}`);
  
  // Replace MySQL specific functions with PostgreSQL equivalents
  pgQuery = pgQuery.replace(/IFNULL\(/g, 'COALESCE(');
  pgQuery = pgQuery.replace(/CURRENT_DATE\(\)/g, 'CURRENT_DATE');
  pgQuery = pgQuery.replace(/cast\((\w+) as unsigned\)/gi, 'CAST($1 AS INTEGER)');
  pgQuery = pgQuery.replace(/DATEDIFF\(([^,]+),\s*([^)]+)\)/g, '($1 - $2)');
  
  return { query: pgQuery, params };
};

// Common queries converted to PostgreSQL
const queries = {
  // User queries
  createUser: `
    INSERT INTO users (user_name, user_password, name, surname, role, withdraw, add_new, purchase) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  `,
  
  findUser: `
    SELECT * FROM users WHERE user_name = $1 AND role = $2
  `,
  
  getUserDetail: `
    SELECT user_name, name, surname, role, withdraw, add_new, purchase 
    FROM users WHERE user_name = $1
  `,
  
  userList: `
    SELECT name, surname, role, withdraw, add_new, purchase, role_name 
    FROM users INNER JOIN user_role ON users.role = user_role.role_id
  `,
  
  // Product queries
  getAllProducts: `
    SELECT * FROM product 
    INNER JOIN unit ON product.unit = unit.unit_id 
    INNER JOIN type ON product.type = type.type_id 
    INNER JOIN category ON product.category = category.category_id 
    ORDER BY CAST(id AS INTEGER)
  `,
  
  getQuantity: `
    SELECT SUM(quantity) as p_quantity 
    FROM lot WHERE p_id = $1 AND location_id IS NOT NULL
  `,
  
  checkProductID: `
    SELECT COUNT(*) as countID FROM product WHERE id = $1
  `,
  
  addNewProduct: `
    INSERT INTO product (id, name, low_stock, unit, type, category, detail, direction) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  `,
  
  // Inventory summary queries
  countProducts: `
    SELECT COUNT(*) as totalProduct FROM product
  `,
  
  lowStockProducts: `
    SELECT
        product.id AS p_id,
        product.name AS p_name,
        unit.unit_name AS unit,
        product.low_stock,
        COALESCE(SUM(lot.quantity), 0) AS total_quantity,
        CASE
            WHEN COALESCE(SUM(lot.quantity), 0) <= product.low_stock THEN 'Low Stock'
            ELSE 'Sufficient Stock'
        END AS stock_status
    FROM
        product
    LEFT JOIN
        lot ON product.id = lot.p_id
    LEFT JOIN
        unit ON product.unit = unit.unit_id
    WHERE lot.quantity > 0 AND lot.location_id IS NOT NULL
    GROUP BY
        lot.p_id, product.id, product.name, unit.unit_name, product.low_stock
  `,
  
  outOfStockProducts: `
    SELECT
        product.id AS p_id,
        product.name AS p_name,
        product.low_stock,
        COALESCE(SUM(lot.quantity), 0) AS total_quantity,
        CASE
            WHEN COALESCE(SUM(lot.quantity), 0) <= 0 THEN 'Out of Stock'
        END AS stock_status
    FROM
        product
    LEFT JOIN
        lot ON product.id = lot.p_id
    WHERE lot.quantity <= 0 OR lot.quantity IS NULL
    GROUP BY
        product.id, product.name, product.low_stock
  `,
  
  overdueLots: `
    SELECT *, (exp_date - CURRENT_DATE) AS days_overdue
    FROM lot
    LEFT JOIN product ON lot.p_id = product.id
    LEFT JOIN location ON lot.location_id = location.location_id
    LEFT JOIN warehouse ON warehouse.warehouse_id = location.warehouse_id
    WHERE (exp_date - CURRENT_DATE) <= before_date AND lot.location_id IS NOT NULL
  `
};

module.exports = { convertQuery, queries };
