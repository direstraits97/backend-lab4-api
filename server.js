const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/api", authRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Skyddad route." });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    res.status(
      401,
      json({ error: "Not authorized for this route - token missing!" }),
    );
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
    if (err) {
      return res.status(403).json({ error: "Invalid JWT." });
    }

    req.username = username;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
