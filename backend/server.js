require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔥 serve uploaded files
app.use("/uploads", express.static("uploads"));

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   MULTER CONFIG
   ========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

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
  } catch {
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

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Bad token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* =========================
   NOTES
   ========================= */

// GET notes
app.get("/notes", requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, module, title, content, file_url FROM notes WHERE user_id = ?",
    [req.user.userId]
  );
  res.json(rows);
});

// ADD note (TEXT + FILE)
app.post(
  "/notes",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    const { module, title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      "INSERT INTO notes (module, title, content, file_url, user_id) VALUES (?, ?, ?, ?, ?)",
      [module, title, content, fileUrl, req.user.userId]
    );

    res.json({ message: "Note added" });
  }
);

// ✅ UPDATE note (TEXT + OPTIONAL FILE)
app.put(
  "/notes/:id",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    const { module, title, content } = req.body;
    const id = Number(req.params.id);

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (fileUrl) {
      await pool.query(
        "UPDATE notes SET module = ?, title = ?, content = ?, file_url = ? WHERE id = ? AND user_id = ?",
        [module, title, content, fileUrl, id, req.user.userId]
      );
    } else {
      await pool.query(
        "UPDATE notes SET module = ?, title = ?, content = ? WHERE id = ? AND user_id = ?",
        [module, title, content, id, req.user.userId]
      );
    }

    res.json({ message: "Updated" });
  }
);

// DELETE note
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
