const express = require("express");
const router = express.Router();
const database = require("better-sqlite3");
const bcrypt = require("bcrypt");

require("dotenv").config();
const db = new database(process.env.DATABASE);

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Invalid input, please enter username and password." });
  }

  const checkUsers = db
    .prepare(`SELECT * FROM users WHERE username=?;`)
    .get(username);

  if (checkUsers) {
    return res.status(409).json({ error: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const stmt = db.prepare(`INSERT INTO users(username, password) VALUES(?,?);`);

  try {
    stmt.run(username, hashedPassword);

    res.status(201).json({ message: "New user created." });
  } catch (error) {
    res.status(500).json({ error: "Could not register new user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Invalid input, please enter username and password." });
    }

    const stmt = db.prepare(`SELECT * FROM users WHERE username=?`);
    const row = stmt.get(username);

    if (!row) {
      return res.status(401).json({ error: "Incorrect username/password." });
    }

    const passwordMatch = await bcrypt.compare(password, row.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect username/password." });
    }

    res.status(200).json({ message: "Succesful login!" });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
