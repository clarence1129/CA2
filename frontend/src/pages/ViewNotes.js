import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!token) {
      setNotes([]);
      return;
    }

    fetch("http://localhost:5000/notes", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          setNotes([]);
        }
      })
      .catch(() => setNotes([]));
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteNote = (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmDelete) return;

    fetch("http://localhost:5000/notes/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setNotes(prev => prev.filter(note => note.id !== id));
      })
      .catch(() => {
        alert("Delete failed.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
        fontFamily: "'Nunito', sans-serif"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700
            }}
          >
            ✨ Study Notes
          </h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Keep your thoughts organised
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {!isLoggedIn && (
            <>
              <button onClick={() => navigate("/login")} style={primaryBtn}>
                Login
              </button>
              <button onClick={() => navigate("/register")} style={secondaryBtn}>
                Register
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
              <button onClick={() => navigate("/add")} style={primaryBtn}>
                + Add Note
              </button>
              <button onClick={logout} style={dangerBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* NOTES */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {notes.length === 0 && (
          <p style={{ color: "white", opacity: 0.7 }}>
            No notes yet.
          </p>
        )}

        {Array.isArray(notes) &&
          notes.map(note => (
            <div
              key={note.id}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.12)",
                padding: "28px",
                borderRadius: "28px",
                marginBottom: "24px",
                color: "white"
              }}
            >
              {isLoggedIn && (
                <button
                  onClick={() => deleteNote(note.id, note.title)}
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    background: "transparent",
                    border: "none",
                    color: "#fca5a5",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              )}

              <span
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginBottom: "14px",
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {note.module}
              </span>

              <h3
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "20px",
                  marginBottom: "6px"
                }}
              >
                {note.title}
              </h3>

              <p>{note.content}</p>

              {/* 📎 FILE / IMAGE DISPLAY */}
              {note.file_url && (
                <>
                  {note.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={"http://localhost:5000" + note.file_url}
                      alt="Attachment"
                      style={{
                        width: "100%",
                        maxHeight: "260px",
                        objectFit: "cover",
                        borderRadius: "18px",
                        marginTop: "14px"
                      }}
                    />
                  ) : (
                    <a
                      href={"http://localhost:5000" + note.file_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "14px",
                        color: "#93c5fd",
                        textDecoration: "underline"
                      }}
                    >
                      📎 View / Download Attachment
                    </a>
                  )}
                </>
              )}

              {isLoggedIn && (
                <button
                  onClick={() => navigate(`/edit/${note.id}`)}
                  style={{ ...secondaryBtn, marginTop: "16px" }}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

/* BUTTON STYLES */
const primaryBtn = {
  height: "44px",
  padding: "0 22px",
  borderRadius: "999px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const secondaryBtn = {
  height: "44px",
  padding: "0 22px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.4)",
  background: "transparent",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const dangerBtn = {
  height: "44px",
  padding: "0 22px",
  borderRadius: "999px",
  border: "none",
  background: "#dc2626",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export default ViewNotes;
