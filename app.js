import express from 'express';

import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from "cookie-parser";

// Route imports
import login from "./routes/login.js";

const app = express();


// Enable CORS
app.use(cors({
  origin: "http://localhost:3001", // Adjust as needed
  methods: ["GET", "POST", "DELETE"],
  credentials: true,

}));

app.use(express.json());

// Session cookies
app.use(session({
  secret: "48203fe548e31071c86ad69497e77c6d4704c15515307c25f5de1c6d5dc032ad",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Root test route
app.get('/', (req, res) => {
  res.send('hi');
});

app.use("/login", login);


export default app;
