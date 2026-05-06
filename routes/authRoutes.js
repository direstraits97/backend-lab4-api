/**
 * Denna fil sköter registrering och inloggning med lagrade konton i databasen. Lösenord hashas innan lagring och varje inloggning genererar JWT-token.
 * Av: Josefine Backlund
 */

const express = require("express");
const router = express.Router();
const database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const db = new database(process.env.DATABASE);

router.post("/register", async (req, res) => {
  const { username, password } = req.body; //Efterfrågar värden från body.

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Invalid input, please enter username and password." }); //Om det är tomt.
  }

  const checkUsers = db
    .prepare(`SELECT * FROM users WHERE username=?;`)
    .get(username);

  if (checkUsers) {
    return res.status(409).json({ error: "User already exists." }); //Om användarnamnet redan finns i databasen blir det ett konfliktfel.
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10); //Lösenordet hashas innan lagring i databasen.

  const stmt = db.prepare(`INSERT INTO users(username, password) VALUES(?,?);`);

  try {
    stmt.run(username, hashedPassword); //Lagring.

    res.status(201).json({ message: "New user created." });
  } catch (error) {
    res.status(500).json({ error: "Could not register new user." }); //Server-fel.
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; //Efterfrågar värden från body.

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Invalid input, please enter username and password." }); //Om det är tomt.
    }

    const stmt = db.prepare(`SELECT * FROM users WHERE username=?;`);
    const row = stmt.get(username);

    if (!row) {
      return res.status(401).json({ error: "Incorrect username/password." }); //Om användarnamnet inte finns i databasen.
    }

    const passwordMatch = await bcrypt.compare(password, row.password); //hashat lösenord jämförs för matchning.

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect username/password." }); //Om det inte matchar.
    } else {
      const payload = { username: username, created: row.created };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      }); //En token skapas med användaruppgifter och nyckeln från env-filen.

      const response = {
        //Vid lyckat svar skickas ett meddelande samt token.
        message: "Succesful login!",
        token: token,
      };
      res.status(200).json({ response });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." }); //Server-fel.
  }
});

module.exports = router;
