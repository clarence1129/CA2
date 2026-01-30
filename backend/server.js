const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* Temporary notes data */
let notes = [
  {
    id: 1,
    title: "React Basics",
    content: "Components and props",
    module: "C219"
  }
];

/* Test route */
app.get("/", (req, res) => {
  res.send("Server is running!");
});

/* Get all notes */
app.get("/notes", (req, res) => {
  res.json(notes);
});

/* Add new note */
app.post("/notes", (req, res) => {
  const newNote = req.body;

  newNote.id = notes.length + 1;
  notes.push(newNote);

  res.json(newNote);
});

/* Update note */
app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedNote = req.body;

  notes = notes.map(note =>
    note.id === id ? { ...note, ...updatedNote } : note
  );

  res.json({ message: "Note updated" });
});

/* Delete note */
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  notes = notes.filter(note => note.id !== id);

  res.json({ message: "Note deleted" });
});

/* Start server */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
