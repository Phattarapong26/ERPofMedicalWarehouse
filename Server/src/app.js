import { Pool } from "pg";
import cors from "cors";
import express, { json } from "express";
const app = express();

app.use(cors());
app.use(json());

const db = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  password: "postgres",
  database: "medlab",
});

// Test connection
db.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

app.get("/product", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM product");
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
