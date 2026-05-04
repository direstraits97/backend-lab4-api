require("dotenv").config();
const database = require("better-sqlite3");

const db = new database(process.env.DATABASE);

db.exec(`DROP TABLE IF EXISTS users;`);
db.exec(`
  CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `);
