import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password are required.");
      return;
    }

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then(data => {
        localStorage.setItem("token", data.token);
        navigate("/");
      })
      .catch(() => {
        setError("Invalid username or password.");
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
        onSubmit={login}
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
            marginBottom: "24px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "26px"
          }}
        >
          🔐 Login
        </h2>

        {error && (
          <p style={{ color: "#fca5a5", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button style={primaryButtonStyle}>
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={secondaryButtonStyle}
        >
          Register
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
  cursor: "pointer"
};

const secondaryButtonStyle = {
  width: "100%",
  height: "52px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.4)",
  background: "transparent",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "14px"
};

export default Login;
