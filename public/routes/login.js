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


let refreshTokens = [];


const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
}

app.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user.id, email: user.email, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false, // true if using HTTPS
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        firebaseUid: user.firebaseUid,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh token route
app.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    res.json({ accessToken });
  });
});

export default app;
