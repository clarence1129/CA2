import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔒 AUTH GUARD
  if (!token) {
    navigate("/login");
    return null;
  }

  const submitNote = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("module", module);
    formData.append("title", title);
    formData.append("content", content);

    if (file) {
      formData.append("file", file); // 👈 image / pdf / any file
    }

    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
        // ❌ DO NOT set Content-Type for FormData
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        alert("Unable to add note");
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
        onSubmit={submitNote}
        style={{
          width: "440px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          padding: "44px",
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
          ➕ Add Note
        </h2>

        <input
          placeholder="Module"
          value={module}
          onChange={e => setModule(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={textareaStyle}
        />

        {/* 📎 FILE UPLOAD */}
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={fileInputStyle}
        />

        <button type="submit" style={primaryButtonStyle}>
          Save Note
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
  marginBottom: "18px",
  borderRadius: "22px",
  border: "none",
  outline: "none",
  resize: "none",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "15px",
  boxSizing: "border-box"
};

const fileInputStyle = {
  width: "100%",
  marginBottom: "22px",
  color: "white",
  fontFamily: "'Nunito', sans-serif"
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
  background: "#dc2626",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "14px",
  boxSizing: "border-box"
};

export default AddNote;
