const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = "dev_secret_change_me";

/* =========================
   USERS (IN MEMORY)
   ========================= */
let users = [];

/* =========================
   NOTES
   ========================= */
let notes = [];

/* =========================
   REGISTER
   ========================= */
app.post("/register", (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    username = username.trim().toLowerCase();

    const exists = users.find(u => u.username === username);
    if (exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    users.push({
      id: Date.now(),
      username,
      password
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Register failed" });
  }
});

/* =========================
   LOGIN
   ========================= */
app.post("/login", (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim().toLowerCase();

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

/* =========================
   AUTH MIDDLEWARE
   ========================= */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer") return res.status(401).json({ error: "Bad token" });

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
app.get("/notes", (req, res) => {
  res.json(notes);
});

app.post("/notes", requireAuth, (req, res) => {
  const { module, title, content } = req.body;

  notes.push({
    id: Date.now(),
    module,
    title,
    content
  });

  res.json({ message: "Note added" });
});

app.put("/notes/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { module, title, content } = req.body;

  notes = notes.map(n =>
    n.id === id ? { ...n, module, title, content } : n
  );

  res.json({ message: "Updated" });
});

app.delete("/notes/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(n => n.id !== id);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
