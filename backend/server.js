const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* =========================
   JWT CONFIG
   ========================= */
const JWT_SECRET = "dev_secret_change_me";

/* =========================
   DEMO USER (as per guide)
   ========================= */
const DEMO_USER = {
  id: 1,
  username: "Team8",
  password: "Team8password"
};

/* =========================
   DATA
   ========================= */
let notes = [
  {
    id: 1,
    module: "C219",
    title: "React Basics",
    content: "Components and props"
  }
];

/* =========================
   LOGIN (JWT)
   ========================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== DEMO_USER.username ||
    password !== DEMO_USER.password
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: DEMO_USER.id, username: DEMO_USER.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* =========================
   AUTH MIDDLEWARE
   ========================= */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* =========================
   NOTES ROUTES
   ========================= */

// PUBLIC – view notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// PROTECTED – add
app.post("/notes", requireAuth, (req, res) => {
  const { module, title, content } = req.body;

  const newNote = {
    id: notes.length + 1,
    module,
    title,
    content
  };

  notes.push(newNote);
  res.json(newNote);
});

// PROTECTED – update
app.put("/notes/:id", requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const { module, title, content } = req.body;

  notes = notes.map(note =>
    note.id === id ? { ...note, module, title, content } : note
  );

  res.json({ message: "Note updated" });
});

// PROTECTED – delete
app.delete("/notes/:id", requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.json({ message: "Note deleted" });
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
