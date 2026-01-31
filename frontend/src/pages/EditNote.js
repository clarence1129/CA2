import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditNote = () => {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [content, setContent] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch notes");
        }
        return res.json();
      })
      .then(data => {
        const note = data.find(n => n.id === parseInt(id));
        if (!note) {
          throw new Error("Note not found");
        }

        setTitle(note.title);
        setModule(note.module);
        setContent(note.content);
      })
      .catch(() => {
        alert("Unable to load note.");
        navigate("/");
      });
  }, [id, navigate]);

  const updateNote = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/notes/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        module: module,
        title: title,
        content: content
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Update failed");
        }
        return res.json();
      })
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        alert("You must be logged in to edit notes.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Nunito', sans-serif"
      }}
    >
      <form
        onSubmit={updateNote}
        style={{
          width: "440px",              // ⬅️ wider
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          padding: "44px",             // ⬅️ more breathing space
          borderRadius: "32px",
          boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
          color: "white",
          boxSizing: "border-box"
        }}
      >
        <h2
          style={{
            marginBottom: "28px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "26px"
          }}
        >
          ✏️ Edit Note
        </h2>

        <input
          value={module}
          onChange={e => setModule(e.target.value)}
          style={inputStyle}
        />

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          style={textareaStyle}
        />

        <button style={primaryButtonStyle}>
          Update Note
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={cancelButtonStyle}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  height: "52px",
  padding: "0 18px",
  marginBottom: "18px",
  borderRadius: "999px",
  border: "none",
  outline: "none",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "15px",
  boxSizing: "border-box"
};

const textareaStyle = {
  width: "100%",
  height: "120px",
  padding: "16px 18px",
  marginBottom: "20px",
  borderRadius: "22px",
  border: "none",
  outline: "none",
  resize: "none",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "15px",
  boxSizing: "border-box"
};

const primaryButtonStyle = {
  width: "100%",
  height: "52px",
  borderRadius: "999px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
  boxSizing: "border-box"
};

const cancelButtonStyle = {
  width: "100%",
  height: "52px",
  borderRadius: "999px",
  border: "none",
  background: "#dc2626",              // 🔴 red cancel
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "14px",
  boxSizing: "border-box"
};

export default EditNote;
