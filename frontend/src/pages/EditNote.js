import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditNote = () => {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/notes", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error();

        const note = data.find(n => n.id === Number(id));
        if (!note) throw new Error();

        setTitle(note.title);
        setModule(note.module);
        setContent(note.content);
        setExistingFile(note.file_url);
      })
      .catch(() => {
        alert("Unable to load note.");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const updateNote = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("module", module);
    formData.append("title", title);
    formData.append("content", content);

    if (file) {
      formData.append("file", file); // 👈 replace file only if selected
    }

    fetch("http://localhost:5000/notes/" + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error();
        navigate("/");
      })
      .catch(() => {
        alert("Unable to update note.");
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
          ✏️ Edit Note
        </h2>

        {loading && (
          <p style={{ opacity: 0.7, marginBottom: "16px" }}>
            Loading note…
          </p>
        )}

        <input
          value={module}
          onChange={e => setModule(e.target.value)}
          placeholder="Module"
          style={inputStyle}
        />

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={inputStyle}
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
          style={textareaStyle}
        />

        {/* EXISTING FILE */}
        {existingFile && (
          <>
            {existingFile.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={"http://localhost:5000" + existingFile}
                alt="Existing"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "18px",
                  marginBottom: "16px"
                }}
              />
            ) : (
              <a
                href={"http://localhost:5000" + existingFile}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginBottom: "16px",
                  color: "#93c5fd"
                }}
              >
                📎 View current attachment
              </a>
            )}
          </>
        )}

        {/* REPLACE FILE */}
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={{ marginBottom: "22px", color: "white" }}
        />

        <button type="submit" style={primaryButtonStyle}>
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
  background: "#dc2626",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "14px",
  boxSizing: "border-box"
};

export default EditNote;
