const db = require('../db');

async function getAllProducts() {
  const sql = `SELECT * FROM product INNER JOIN unit ON product.unit = unit.unit_id INNER JOIN type ON product.type = type.type_id INNER JOIN category ON product.category = category.category_id ORDER BY id`;
  const result = await db.query(sql);
  return result.rows;
}

async function getQuantity(id) {
  const result = await db.query(
    "SELECT SUM(quantity) as p_quantity FROM lot WHERE p_id = $1 AND location_id IS NOT NULL",
    [id]
  );
  return result.rows;
}

async function inventorySummary() {
  const countProductQuery = "SELECT COUNT(*)::int AS total_product FROM product";
  const showLowStockQuery = `
    SELECT 
      p.id AS p_id,
      p.name AS p_name,
      u.unit_name AS unit,
      p.low_stock,
      COALESCE(SUM(l.quantity), 0)::int AS total_quantity,
      CASE WHEN COALESCE(SUM(l.quantity), 0) <= p.low_stock THEN 'Low Stock' ELSE 'Sufficient Stock' END AS stock_status
    FROM product p
    LEFT JOIN lot l ON p.id = l.p_id
    LEFT JOIN unit u ON p.unit = u.unit_id
    GROUP BY p.id, p.name, u.unit_name, p.low_stock
  `;
  const showOutOfStockProductsQuery = `
    SELECT 
      p.id AS p_id,
      p.name AS p_name,
      p.low_stock,
      COALESCE(SUM(l.quantity), 0)::int AS total_quantity,
      CASE WHEN COALESCE(SUM(l.quantity), 0) <= 0 THEN 'Out of Stock' END AS stock_status
    FROM product p
    LEFT JOIN lot l ON p.id = l.p_id
    GROUP BY p.id, p.name, p.low_stock
    HAVING COALESCE(SUM(l.quantity), 0) <= 0
  `;
  const overdueLotsQuery = `
    SELECT 
      l.*, 
      (l.exp_date - CURRENT_DATE) AS days_overdue,
      p.name AS product_name,
      loc.location_name,
      w.warehouse_name
    FROM lot l
    LEFT JOIN product p ON l.p_id = p.id
    LEFT JOIN location loc ON l.location_id = loc.location_id
    LEFT JOIN warehouse w ON w.warehouse_id = loc.warehouse_id
    WHERE l.location_id IS NOT NULL AND (l.exp_date - CURRENT_DATE) <= p.before_date
  `;

  const productResult = await db.query(countProductQuery);
  const totalProductCount = productResult.rows[0].total_product;
  const lowStockResult = await db.query(showLowStockQuery);
  const lowStockProducts = lowStockResult.rows.filter((r) => r.stock_status === 'Low Stock');
  const outOfStockProductsResult = await db.query(showOutOfStockProductsQuery);
  const outOfStockProducts = outOfStockProductsResult.rows;
  const overdueLotsResult = await db.query(overdueLotsQuery);

  return {
    total_product_count: totalProductCount,
    low_stock_products: lowStockProducts,
    out_of_stock_products: outOfStockProducts,
    overdue_lots: overdueLotsResult.rows,
  };
}

async function checkProductID(id) {
  const result = await db.query(
    "SELECT COUNT(*) as countID FROM product WHERE id = $1",
    [id]
  );
  return result.rows;
}

async function addNewProduct(product) {
  const { id, name, low_stock, unit, type, category, detail, direction } = product;
  await db.query(
    "INSERT INTO product (id, name, low_stock, unit, type, category, detail, direction) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, name, low_stock, unit, type, category, detail, direction]
  );
}

async function getDetail(id) {
  const sql = `
    SELECT * FROM product 
    INNER JOIN unit ON product.unit = unit.unit_id 
    INNER JOIN type ON product.type = type.type_id 
    INNER JOIN category ON product.category = category.category_id
    WHERE id = $1
  `;
  const result = await db.query(sql, [id]);
  return result.rows;
}

async function updateProduct(product) {
  const { id, low_stock, name, unit, type, category, detail, direction } = product;
  await db.query(
    "UPDATE product SET name = $1, low_stock = $2, unit = $3, type = $4, category = $5, detail = $6, direction = $7 WHERE id = $8",
    [name, low_stock, unit, type, category, detail, direction, id]
  );
}

async function removeProduct(id) {
  await db.query("DELETE FROM product WHERE id = $1", [id]);
}

module.exports = {
  getAllProducts,
  getQuantity,
  inventorySummary,
  checkProductID,
  addNewProduct,
  getDetail,
  updateProduct,
  removeProduct,
};
