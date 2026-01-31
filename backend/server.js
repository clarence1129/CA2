require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   REGISTER
   ========================= */
app.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    username = username.trim().toLowerCase();

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Register failed" });
  }
});

/* =========================
   LOGIN
   ========================= */
app.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    username = username.trim().toLowerCase();

    const [rows] = await pool.query(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =========================
   AUTH MIDDLEWARE
   ========================= */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const parts = header.split(" ");
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ error: "Bad token" });
  }

  try {
    req.user = jwt.verify(parts[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* =========================
   NOTES
   ========================= */
app.get("/notes", requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, module, title, content FROM notes WHERE user_id = ?",
    [req.user.userId]
  );
  res.json(rows);
});

app.post("/notes", requireAuth, async (req, res) => {
  const { module, title, content } = req.body;

  await pool.query(
    "INSERT INTO notes (module, title, content, user_id) VALUES (?, ?, ?, ?)",
    [module, title, content, req.user.userId]
  );

  res.json({ message: "Note added" });
});

app.put("/notes/:id", requireAuth, async (req, res) => {
  const { module, title, content } = req.body;
  const id = Number(req.params.id);

  await pool.query(
    "UPDATE notes SET module = ?, title = ?, content = ? WHERE id = ? AND user_id = ?",
    [module, title, content, id, req.user.userId]
  );

  res.json({ message: "Updated" });
});

app.delete("/notes/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await pool.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [id, req.user.userId]
  );

  res.json({ message: "Deleted" });
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
