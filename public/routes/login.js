// routes/login.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';
import cookieParser from "cookie-parser";

const app = express.Router();
app.use(cookieParser());


const ACCESS_TOKEN_SECRET = "";

const REFRESH_TOKEN_SECRET = "";



function generateAccessToken(userPayload) {
  return jwt.sign(userPayload, ACCESS_TOKEN_SECRET, { expiresIn: '1m' }); // dev-friendly
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Login route
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { id: user.id, email: user.email, username: user.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await pool.query(
    "INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)",
    [refreshToken, user.id]
  );

  // Send both tokens in body (you can also set cookie here if needed)
  res.status(200).json({
    message: "Login successful",
    token: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    },
  });
});

// Refresh token route
app.post("/token", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const [rows] = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid or expired refresh token:", err.message);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({ accessToken });
  });
});

export default app;
