import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => {
        const note = data.find(n => n.id === parseInt(id));
        if (note) {
          setModule(note.module);
          setTitle(note.title);
          setContent(note.content);
        }
      });
  }, [id]);

  const updateNote = () => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, title, content })
    }).then(() => navigate("/"));
  };

  const deleteNote = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE"
    }).then(() => navigate("/"));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#dbeafe",   // ✅ SAME pastel blue
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Edit Note</h2>

        <input
          value={module}
          onChange={e => setModule(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            height: "80px",
            marginBottom: "15px"
          }}
        />

        <button
          onClick={updateNote}
          onMouseEnter={e => (e.target.style.backgroundColor = "#2980b9")}
          onMouseLeave={e => (e.target.style.backgroundColor = "#3498db")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            marginBottom: "10px",
            cursor: "pointer"
          }}
        >
          Update Note
        </button>

        <button
          onClick={deleteNote}
          onMouseEnter={e => (e.target.style.backgroundColor = "#c0392b")}
          onMouseLeave={e => (e.target.style.backgroundColor = "#e74c3c")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Delete Note
        </button>
      </div>
    </div>
  );
};

export default EditNote;
