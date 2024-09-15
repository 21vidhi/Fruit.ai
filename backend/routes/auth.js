const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const users = []; // In-memory users database

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1h" });
  res.json({ token });
});

// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const userExists = users.some((u) => u.email === email);
  if (userExists) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  res.json({ msg: "User registered" });
});

module.exports = router;
