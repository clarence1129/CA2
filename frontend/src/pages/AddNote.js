import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNote = () => {
  const [module, setModule] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const addNote = () => {
    const confirmAdd = window.confirm(
      "Are you sure you want to add this note?"
    );

    if (!confirmAdd) return;

    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        module: module,
        title: title,
        content: content
      })
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
        <h2 style={{ marginBottom: "15px" }}>Add Note</h2>

        <input
          placeholder="Module (e.g. C219)"
          value={module}
          onChange={e => setModule(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Content"
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
          onClick={addNote}
          onMouseEnter={e => (e.target.style.backgroundColor = "#27ae60")}
          onMouseLeave={e => (e.target.style.backgroundColor = "#2ecc71")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default AddNote;
