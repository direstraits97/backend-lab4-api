/**
 * Detta program importerar routes som sköter inloggning och registrering av konton, och validerar en skyddad route som behöver token för åtkomst.
 * Av: Josefine Backlund
 */

const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); //Importerade routes.
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes); //Routes för registrering och inloggning.

//Nedan är en skyddad route som valideras med en funktion för att kontrollera token.
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ data: req.payload }); //Lyckad åtkomst svarar med payload.
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; //Authorization efterfrågas i headers.
  const token = authHeader && authHeader.split(" ")[1]; //Om den finns att hämta hämtas endast JWT:en och "Bearer " utesluts.

  if (token === null) {
    res.status(
      401,
      json({ error: "Not authorized for this route - token missing!" }), //Felmeddelande om token saknas.
    );
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid JWT." }); //Felmeddelande vid ogiltig token, om den t.ex. gått ut.
    }

    req.payload = payload;
    next(); //Så att resten av get-anropet genomförs.
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
