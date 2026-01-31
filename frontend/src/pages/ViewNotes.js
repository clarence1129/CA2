import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#dbeafe"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        <h1 style={{ margin: 0 }}>Study Notes</h1>

        <div>
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 15px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          )}

          {isLoggedIn && (
            <>
              <button
                onClick={() => navigate("/add")}
                style={{
                  padding: "10px 15px",
                  marginRight: "10px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                + Add Note
              </button>

              <button
                onClick={logout}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* NOTES LIST */}
      {notes.map(note => (
        <div
          key={note.id}
          style={{
            backgroundColor: "#ffffff",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", color: "#555" }}>
            {note.module}
          </p>

          <h3 style={{ margin: "5px 0" }}>{note.title}</h3>
          <p>{note.content}</p>

          {isLoggedIn && (
            <button
              onClick={() => navigate(`/edit/${note.id}`)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#eee",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewNotes;
