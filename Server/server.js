const cors = require("cors");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "Medlab-V.2";
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");
const db = require('./src/db');
const productController = require('./src/controllers/productController');

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    exposedHeaders: ["SET-COOKIE"],
  })
);
app.use(cookieParser());
app.use(express.json());

// db connection handled by ./src/db (env-based)

// ----- User Account -----

// get user role by username
app.post("/getUserRole", jsonParser, async (req, res) => {
  const user_name = req.body.user_name;
  
  try {
    const result = await db.query(
      "SELECT role FROM users WHERE user_name = $1",
      [user_name]
    );
    
    if (result.rows.length > 0) {
      res.json({ 
        status: "success", 
        role: result.rows[0].role 
      });
    } else {
      res.json({ 
        status: "not found", 
        message: "User not found" 
      });
    }
  } catch (err) {
    res.json({ 
      status: "error", 
      message: err.message 
    });
  }
});

// Seed database with sample data
app.post("/seed-data", async (req, res) => {

  const createdbPath = "/usr/local/opt/postgresql@14/bin/createdb";
  const cwd = __dirname + "/";

  const run = (cmd) => new Promise((resolve) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr, cmd });
    });
  });

  try {
    const steps = [];

    // 1) Create DB if not exists
    const createResult = await run(`${createdbPath} medlab`);
    if (createResult.error && !/already exists/i.test(createResult.stderr || "")) {
      // If error is not "already exists" then return
      return res.status(500).json({ status: "error", step: "createdb", ...createResult });
    }
    steps.push({ step: "createdb", ...createResult });

    // 2) Apply schema.sql
    const schemaResult = await run(`${psqlPath} -d medlab -f schema.sql`);
    if (schemaResult.error) {
      return res.status(500).json({ status: "error", step: "schema.sql", ...schemaResult });
    }
    steps.push({ step: "schema.sql", ...schemaResult });

    // 3) Apply sample-data.sql
    const sampleResult = await run(`${psqlPath} -d medlab -f sample-data.sql`);
    if (sampleResult.error) {
      return res.status(500).json({ status: "error", step: "sample-data.sql", ...sampleResult });
    }
    steps.push({ step: "sample-data.sql", ...sampleResult });

    return res.json({ status: "success", message: "Seed completed", steps });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
});

// get all users list
app.get("/userList", jsonParser, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        users.id,
        users.user_name,
        users.name,
        users.surname,
        users.role,
        users.withdraw,
        users.add_new,
        users.purchase,
        users.created_at,
        user_role.role_name
      FROM users 
      INNER JOIN user_role ON users.role = user_role.role_id
      ORDER BY users.id
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.json({ 
      status: "error", 
      message: err.message 
    });
  }
});

// create user
app.post("/createAccount", jsonParser, async (req, res) => {
  const user_name = req.body.user_name;
  const user_password = req.body.user_password;
  const name = req.body.name;
  const surname = req.body.surname;
  const role = req.body.role;
  const withdraw = req.body.withdraw;
  const add_new = req.body.add_new;
  const purchase = req.body.purchase;
  
  try {
    const hash = await bcrypt.hash(user_password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (user_name, user_password, name, surname, role, withdraw, add_new, purchase) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
      [user_name, hash, name, surname, role, withdraw, add_new, purchase]
    );
    res.json({
      status: "success",
      message: "Account created successfully",
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//login and gen jwt token
app.post("/login", jsonParser, async (req, res) => {
  const user_name = req.body.user_name;
  const user_password = req.body.user_password;
  const role = req.body.role;

  try {
    //check user account in database
    const userResult = await db.query(
      "SELECT * FROM users WHERE user_name = $1 AND role = $2",
      [user_name, role]
    );
    
    //if user not found return "not found"
    if (userResult.rows.length == 0) {
      res.json({ status: "not found", message: "User not found" });
      return;
    }
    
    //if all value correct return jwt token and status
    const isPasswordValid = await bcrypt.compare(user_password, userResult.rows[0].user_password);
    
    if (isPasswordValid) {
      const tokenUsername = jwt.sign(
        { user_name: userResult.rows[0].user_name },
        secret,
        { expiresIn: "1h" }
      );
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie("token", tokenUsername, {
        // maxAge: 500000,
        secure: isProd, // secure only in production (HTTPS)
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax', // allow localhost dev to receive cookies
      });
      res.json({
        status: "success",
        message: "Login successfully",
      });
    } else {
      res.json({ status: "error", message: "Login failed" });
    }
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

// check jwt token and return user detail for check withdraw and add_new rights
app.get("/authen", jsonParser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.verify(token, secret);
    const result = await db.query(
      "SELECT user_name,name,surname,role,withdraw,add_new,purchase FROM users WHERE user_name = $1",
      [user.user_name]
    );
    res.send(result.rows);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.get("/logout", jsonParser, (req, res) => {
  res.clearCookie("token");
  res.send("Cooking Cleared");
});

app.get("/userList", jsonParser, async (req, res) => {
  const sql = `
  SELECT name,surname, role, withdraw, add_new, purchase, role_name 
  FROM users INNER JOIN user_role ON users.role = user_role.role_id `;
  try {
    const result = await db.query(sql);
    res.send(result.rows);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});
app.post("/getUserDetail", jsonParser, async (req, res) => {
  const user_name = req.body.username;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE user_name = $1",
      [user_name]
    );
    res.send(result.rows);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

// ----- Product -----

app.get("/product", jsonParser, productController.getProducts);

app.post("/getQuantity", jsonParser, productController.getQuantity);

app.get("/inventorySummary", async (req, res) => {
  // delegate to controller
  return productController.inventorySummary(req, res);
});

app.post("/checkProductID", jsonParser, productController.checkProductID);

app.post("/addNewProduct", jsonParser, productController.addNewProduct);

app.post("/getDetail", jsonParser, productController.getDetail);

app.put("/updateProduct", jsonParser, productController.updateProduct);

app.delete("/removeProduct", jsonParser, productController.removeProduct);

// ----- Order -----
app.post("/purchase", jsonParser, async (req, res) => {
  const user_name = req.body.user_name;
  const orderList = req.body.orderList;
  try {
    // 1. Create purchase record
    const purchaseResult = await db.query(
      "INSERT INTO purchase (created_by) VALUES ($1) RETURNING purchase_id",
      [user_name]
    );
    const purchase_id = purchaseResult.rows[0].purchase_id;

    // 2. Insert lots and collect lot_ids
    const lotIds = [];
    for (const order of orderList) {
      const lotResult = await db.query(
        "INSERT INTO lot (p_id, quantity) VALUES ($1, $2) RETURNING lot_id",
        [order.p_id, order.quantity]
      );
      lotIds.push(lotResult.rows[0].lot_id);
    }

    // 3. Insert purchase_detail
    for (let i = 0; i < orderList.length; i++) {
      await db.query(
        "INSERT INTO purchase_detail (purchase_id, lot_id, p_id, quantity) VALUES ($1, $2, $3, $4)",
        [purchase_id, lotIds[i], orderList[i].p_id, orderList[i].quantity]
      );
    }

    res.json({
      status: "success",
      message: "Insert Successfully",
      purchase_id,
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.post("/purchaseDetail", jsonParser, async (req, res) => {
  const purchase_id = req.body.purchase_id;
  const sql = `
    SELECT * FROM purchase_detail
    INNER JOIN lot ON purchase_detail.lot_id = lot.lot_id
    INNER JOIN product ON lot.p_id = product.id
    INNER JOIN unit ON product.unit = unit.unit_id
    WHERE purchase_id = $1
  `;
  try {
    const result = await db.query(sql, [purchase_id]);
    res.send(result.rows);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

// ----- Warehouse, Location -----
app.get("/getWarehouse", jsonParser, (req, res) => {
  db.query("SELECT * FROM warehouse", (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result.rows);
    }
  });
});
app.post("/createWarehouse", jsonParser, async (req, res) => {
  const name = req.body.name;
  try {
    // Check exist
    const check = await db.query(
      "SELECT 1 FROM warehouse WHERE warehouse_name = $1",
      [name]
    );
    if (check.rows.length > 0) {
      return res.json({
        status: "Already",
        message: "Warehouse name already exist",
      });
    }

    // Insert
    await db.query(
      "INSERT INTO warehouse (warehouse_name) VALUES ($1)",
      [name]
    );
    return res.json({ status: "success", message: "Created" });
  } catch (err) {
    return res.json({ status: "error", message: err.message });
  }
});

app.post("/Warehouse", jsonParser, (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  // get total locations in warehouse
  const totalLocations = `
      SELECT COUNT(*) AS total_locations
      FROM location
      WHERE warehouse_id = ?`;

  // get total lots in warehouse along with count where before_date >= DATEDIFF(exp_date, due_date)
  const totalLots = `
      SELECT
        COUNT(lot.lot_id) AS total_lots,
        SUM(CASE WHEN lot.before_date >= DATEDIFF(lot.exp_date, lot.due_date) THEN 1 ELSE 0 END) AS total_lots_before_date
      FROM location l
      LEFT JOIN lot ON l.location_id = lot.location_id
      WHERE l.warehouse_id = ?
      GROUP BY l.location_id`;

  // Execute total locations query
  db.query(totalLocations, warehouse_id, (err, totalLocationsResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }

    db.query(totalLots, warehouse_id, (err, totalLotsResult) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      const totalLotsCount = totalLotsResult.reduce(
        (total, current) => total + current.total_lots,
        0
      );
      const totalLotsBeforeDateCount = totalLotsResult.reduce(
        (total, current) => total + current.total_lots_before_date,
        0
      );

      res.json({
        status: "success",
        total_locations: totalLocationsResult[0].total_locations,
        total_lots: totalLotsCount,
        total_lots_before_date: totalLotsBeforeDateCount,
      });
    });
  });
});

app.post("/WarehouseDetail", jsonParser, async (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  const lotsInLocation = `
      SELECT 
        location.*, warehouse.*, lot.*, product.*, unit.*, 
        EXTRACT(DAY FROM (lot.exp_date - lot.due_date))::int AS days_left
      FROM location
      LEFT JOIN warehouse ON warehouse.warehouse_id = location.warehouse_id
      LEFT JOIN lot ON location.location_id = lot.location_id  
      LEFT JOIN product ON lot.p_id = product.id
      LEFT JOIN unit ON product.unit = unit.unit_id
      WHERE location.warehouse_id = $1 OR lot.location_id IS NULL
      ORDER BY location.Location_name;`;

  try {
    const result = await db.query(lotsInLocation, [warehouse_id]);
    res.send(result.rows);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.delete("/deleteWarehouse", jsonParser, (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  db.query(
    "SELECT * FROM location WHERE warehouse_id = ?",
    [warehouse_id],
    (err, result) => {
      if (!result.length) {
        db.query(
          "DELETE FROM warehouse WHERE warehouse_id = ?",
          warehouse_id,
          (err, result) => {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              res.json({ status: "success", message: "Delete  Successfully" });
            }
          }
        );
      } else {
        res.json({
          status: "error",
          message: "Cannot delete warehouse with existing location",
        });
      }
    }
  );
});

app.post("/createLocation", jsonParser, async (req, res) => {
  const location_name = req.body.location_name;
  const warehouse_id = req.body.warehouse_id;

  try {
    const existing = await db.query(
      "SELECT 1 FROM location WHERE Location_name = $1",
      [location_name]
    );
    if (existing.rows.length > 0) {
      return res.json({ status: "Already", message: "Location already exists" });
    }

    await db.query(
      "INSERT INTO location (Location_name, warehouse_id) VALUES ($1, $2)",
      [location_name, warehouse_id]
    );
    return res.json({ status: "success", message: "Created" });
  } catch (err) {
    return res.json({ status: "error", message: err.message });
  }
});

app.delete("/deleteLocation", jsonParser, async (req, res) => {
  const location_name = req.body.location_name;
  try {
    await db.query(
      "DELETE FROM location WHERE Location_name = $1",
      [location_name]
    );
    res.json({ status: "success", message: "Delete Successfully" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//get all and empty location
app.get("/getAllLocation", jsonParser, (req, res) => {
  const allLocation = `SELECT * FROM location`;
  const emptyLocation = `
    SELECT location.*
    FROM location
    LEFT JOIN lot ON location.location_id = lot.location_id
    WHERE lot.location_id IS NULL`;

  db.query(allLocation, (err, allLocationResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      const allLocations = allLocationResult.rows;

      db.query(emptyLocation, (err, emptyLocationResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const emptyLocations = emptyLocationResult.rows;

          res.json({
            status: "success",
            all_locations: allLocations,
            empty_locations: emptyLocations,
          });
        }
      });
    }
  });
});

// ----- Import -----
// Get Empty Location

app.get("/getEmptyLocation", jsonParser, (req, res) => {
  const sql = `
  SELECT warehouse.warehouse_id, warehouse.warehouse_name,location.location_id, location.Location_name
  FROM location 
  LEFT JOIN warehouse ON location.warehouse_id = warehouse.warehouse_id
  LEFT JOIN lot ON location.location_id = lot.location_id 
  WHERE lot.location_id IS NULL`;
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

app.post("/getDetailForImport", jsonParser, (req, res) => {
  const purchase_id = req.body.purchase_id;

  // Query to check if there are any purchase records for the given purchase ID
  let purchaseCheck = `
    SELECT COUNT(*) AS purchaseCount
    FROM purchase
    WHERE purchase_id = ?`;

  db.query(purchaseCheck, purchase_id, (err, purchaseCheckResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }

    const purchaseCount = purchaseCheckResult[0].purchaseCount;

    if (purchaseCount === 0) {
      res.json({
        status: "No purchase order",
        message: "No purchase order found for the given purchase ID",
      });
      return;
    }

    // Query to count occurrences of lot.location_id that are not null
    let LocationCount = `
      SELECT COUNT(*) AS locationCount
      FROM purchase_detail
      WHERE purchase_id = ?  AND location_id IS NOT NULL`;

    // Query to count occurrences of lot.exp_date that are empty
    let ExpDateCount = `
      SELECT COUNT(*) AS expDateCount
      FROM lot
      LEFT JOIN purchase_detail ON lot.lot_id = purchase_detail.lot_id
      WHERE purchase_detail.purchase_id = ? AND lot.exp_date IS NULL`;

    db.query(LocationCount, purchase_id, (err, locationResult) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      const locationCount = locationResult[0].locationCount;

      if (locationCount > 0) {
        res.json({
          status: "Imported",
          message: "Locations are already imported",
        });
        return;
      }

      // Execute the query to count empty exp_dates
      db.query(ExpDateCount, purchase_id, (err, expDateResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        const expDateCount = expDateResult[0].expDateCount;
        // If waiting for vendor, send response
        if (expDateCount > 0) {
          res.json({
            status: "Waiting",
            message: "Waiting for vendor to provide expiration dates",
          });
          return;
        }

        // Query to retrieve purchase details
        let sql = `
          SELECT *
          FROM purchase_detail
          LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
          LEFT JOIN lot ON lot.lot_id = purchase_detail.lot_id
          LEFT JOIN product ON product.id = lot.p_id
          LEFT JOIN unit ON product.unit = unit.unit_id
          LEFT JOIN location ON location.location_id = lot.location_id
          WHERE purchase.purchase_id = ?`;

        // Execute the main query
        db.query(sql, purchase_id, (err, result) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          } else {
            if (result.length === 0) {
              res.json({
                status: "Not found",
                message: "No records found for the given purchase ID",
              });
            } else {
              res.json({ status: "success", data: result });
            }
          }
        });
      });
    });
  });
});

app.put("/import", jsonParser, (req, res) => {
  const purchase_id = req.body.purchase_id;
  const user_name = req.body.user_name;
  const updateList = req.body.updateList;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.json({
        status: "error",
        message: "Transaction failed to start",
      });
    }

    // Insert into import table
    let importSQL = `INSERT INTO import (purchase_id, importer) VALUES (?, ?)`;
    db.query(importSQL, [purchase_id, user_name], (err, importResult) => {
      if (err) {
        // Rollback transaction if insert operation fails
        return db.rollback(() => {
          res.json({
            status: "error",
            message: "Failed to import data",
            error: err,
          });
        });
      }

      // Update location_id in lot table for each item in updateList array
      let updatePromises = updateList.map((updateItem) => {
        return new Promise((resolve, reject) => {
          // Update location_id in lot table
          let updateLot = `UPDATE lot SET location_id = ?, before_date = ? WHERE lot_id = ?`;
          db.query(
            updateLot,
            [updateItem.location_id, updateItem.before_date, updateItem.lot_id],
            (err, updateLotResult) => {
              if (err) {
                reject(err);
              } else {
                // Update location_id in purchase_detail table
                let updatePurchaseDetail = `UPDATE purchase_detail SET location_id = ? WHERE lot_id = ?`;
                db.query(
                  updatePurchaseDetail,
                  [updateItem.location_id, updateItem.lot_id],
                  (err, updatePurchaseDetailResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(updatePurchaseDetailResult);
                    }
                  }
                );
              }
            }
          );
        });
      });

      // Execute all update promises
      Promise.all(updatePromises)
        .then(() => {
          // Commit transaction if all updates are successful
          db.commit((err) => {
            if (err) {
              // Rollback transaction if commit fails
              return db.rollback(() => {
                res.json({
                  status: "error",
                  message: "Failed to commit transaction",
                  error: err,
                });
              });
            }
            // If everything is successful, send success response
            res.json({ status: "success", message: "Imported Successfully" });
          });
        })
        .catch((updateErr) => {
          // Rollback transaction if any update operation fails
          return db.rollback(() => {
            res.json({
              status: "error",
              message: "Failed to update location",
              error: updateErr,
            });
          });
        });
    });
  });
});

// ----- Export -----
app.post("/getDetailForExport", jsonParser, (req, res) => {
  const p_id = req.body.id;

  db.query(
    "SELECT SUM(quantity) AS total_quantity FROM lot WHERE p_id = ? GROUP BY p_id",
    [p_id],
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
      } else {
        res.json({ status: "success", data: result });
      }
    }
  );
});

app.put("/export", (req, res) => {
  const exportOrders = req.body.exportOrders;
  const exporter = req.body.exporter;
  const receiver = req.body.receiver;
  let exportId;

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
      return;
    }

    // Insert record into export table
    db.query(
      "INSERT INTO export (exporter,receiver) VALUES (?,?)",
      [exporter, receiver],
      (err, exportResult) => {
        if (err) {
          console.error("Error inserting into export table:", err);
          db.rollback(() => {
            res
              .status(500)
              .json({ status: "error", message: "Internal Server Error" });
          });
          return;
        }
        // Retrieve the generated export_id
        exportId = exportResult.insertId;

        // Function to handle export of each order
        const processExport = (order) => {
          return new Promise((resolve, reject) => {
            const { p_id, quantity } = order;
            let remainingQuantity = quantity;

            const sql = `
            SELECT * FROM lot
            WHERE p_id = ?
            ORDER BY exp_date ASC
          `;
            db.query(sql, [p_id], (err, result) => {
              if (err) {
                console.error("Error retrieving lot:", err);
                reject(err);
                return;
              }

              // Iterate through the lots to export the required quantity
              for (const lot of result) {
                if (remainingQuantity <= 0) break;

                const availableQuantity = Math.min(
                  lot.quantity,
                  remainingQuantity
                );

                // Insert a record into export_detail for each lot export, including export_id and location_id
                db.query(
                  "INSERT INTO export_detail (export_id, lot_id, p_id, quantity, location_id) VALUES (?, ?, ?, ?, ?)",
                  [
                    exportId,
                    lot.lot_id,
                    lot.p_id,
                    availableQuantity,
                    lot.location_id,
                  ],
                  (err, exportDetailResult) => {
                    if (err) {
                      console.error("Error inserting export detail:", err);
                      reject(err);
                      return;
                    }
                  }
                );

                // Update the remaining quantity in the lot
                const updatedQuantity = lot.quantity - availableQuantity;
                db.query(
                  "UPDATE lot SET quantity = ? WHERE lot_id = ?",
                  [updatedQuantity, lot.lot_id],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating lot quantity:", err);
                      reject(err);
                      return;
                    }

                    // Set location_id to null if quantity becomes zero
                    if (updatedQuantity === 0) {
                      db.query(
                        "UPDATE lot SET location_id = NULL WHERE lot_id = ?",
                        [lot.lot_id],
                        (err, updateLocationResult) => {
                          if (err) {
                            console.error("Error updating lot location:", err);
                            reject(err);
                            return;
                          }
                        }
                      );
                    }
                  }
                );

                remainingQuantity -= availableQuantity;
              }

              if (remainingQuantity > 0) {
                console.error(
                  `Insufficient quantity available for product ID ${productId}`
                );
                reject(
                  new Error(
                    `Insufficient quantity available for product ID ${productId}`
                  )
                );
                return;
              }

              resolve();
            });
          });
        };

        const promises = [];

        // Iterate through each export order and process export
        exportOrders.forEach((order) => {
          promises.push(processExport(order));
        });

        // Execute all promises and commit transaction
        Promise.all(promises)
          .then(() => {
            db.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                res
                  .status(500)
                  .json({ status: "error", message: "Internal Server Error" });
                return;
              }
              res.json({
                status: "success",
                export_id: exportId,
                message: "Products exported successfully",
              });
            });
          })
          .catch((error) => {
            console.error("Error processing export:", error);
            db.rollback(() => {
              res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
            });
          });
      }
    );
  });
});

app.post("/exportDetail", jsonParser, (req, res) => {
  const exportID = req.body.export_id;
  const sql = `
  SELECT *, export_detail.location_id, export_detail.quantity FROM export_detail 
  INNER JOIN lot ON export_detail.lot_id = lot.lot_id
  INNER JOIN location ON export_detail.location_id = location.location_id
  INNER JOIN product ON lot.p_id = product.id
  INNER JOIN unit ON product.unit = unit.unit_id
  INNER JOIN export ON export_detail.export_id = export.export_id
  WHERE export_detail.export_id = ?`;
  db.query(sql, exportID, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      // Check if result array is empty
      if (result.length === 0) {
        res.json({ status: "No data", message: "No data", data: [] });
        return;
      }
      res.send(result);
    }
  });
});

// ----- History -----
app.get("/purchaseHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM purchase", (err, purchaseResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      // Check if purchaseResult array is empty
      if (purchaseResult.length === 0) {
        res.json({ status: "No data", message: "No data", data: [] });
        return;
      }

      const purchaseIds = purchaseResult.map(
        (purchase) => purchase.purchase_id
      );
      const sql = `
        SELECT *,purchase_detail.quantity FROM purchase_detail
        LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
        LEFT JOIN lot on purchase_detail.lot_id = lot.lot_id   
        LEFT JOIN product ON product.id = purchase_detail.p_id
        LEFT JOIN unit ON product.unit = unit.unit_id
        LEFT JOIN location ON location.location_id = purchase_detail.location_id
        WHERE purchase.purchase_id IN (?)`;

      db.query(sql, [purchaseIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = purchaseResult.map((purchase) => {
            const details = detailResult.filter(
              (detail) => detail.purchase_id === purchase.purchase_id
            );
            return { ...purchase, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});

app.get("/importHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM import", (err, importResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      if (importResult.length === 0) {
        res.json({
          status: "No import",
          message: "No import records found",
        });
        return;
      }

      const purchaseIds = importResult.map((imp) => imp.purchase_id);
      const sql = `
        SELECT *,purchase_detail.quantity FROM purchase_detail
        LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
        LEFT JOIN lot ON lot.lot_id = purchase_detail.lot_id
        LEFT JOIN product ON product.id = purchase_detail.p_id
        LEFT JOIN unit ON product.unit = unit.unit_id
        LEFT JOIN location ON location.location_id = purchase_detail.location_id
        WHERE purchase_detail.purchase_id IN (?)`;

      db.query(sql, [purchaseIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = importResult.map((imp) => {
            const details = detailResult.filter(
              (detail) => detail.purchase_id === imp.purchase_id
            );
            return { ...imp, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});

app.get("/exportHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM export", (err, exportResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      if (exportResult.length === 0) {
        res.json({
          status: "No import",
          message: "No import records found",
        });
        return;
      }

      const exportIds = exportResult.map((imp) => imp.export_id);
      const sql = `
      SELECT *, export_detail.location_id, export_detail.quantity FROM export_detail 
      INNER JOIN lot ON export_detail.lot_id = lot.lot_id
      INNER JOIN location ON export_detail.location_id = location.location_id
      INNER JOIN product ON lot.p_id = product.id
      INNER JOIN unit ON product.unit = unit.unit_id
      INNER JOIN export ON export_detail.export_id = export.export_id
      WHERE export_detail.export_id IN (?)`;

      db.query(sql, [exportIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = exportResult.map((imp) => {
            const details = detailResult.filter(
              (detail) => detail.export_id === imp.export_id
            );
            return { ...imp, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as current_time, version() as pg_version");
    res.json({
      status: "success",
      message: "PostgreSQL connection successful",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err.message
    });
  }
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
