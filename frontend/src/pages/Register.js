import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username.length < 5) {
      setError("Username must be at least 5 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || password.length < 8) {
      setError("Password must be 8+ chars, 1 capital, 1 number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess("Account created. Please login.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      if (res.status === 409) {
        setError("Username already exists.");
        return;
      }

      setError(data.error || "Registration failed.");
    } catch {
      setError("Server error. Make sure backend is running.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Nunito', sans-serif"
    }}>
      <form onSubmit={register} style={{
        width: "440px",
        background: "rgba(255,255,255,0.12)",
        padding: "44px",
        borderRadius: "32px",
        color: "white"
      }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>Register</h2>

        {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
        {success && <p style={{ color: "#86efac" }}>{success}</p>}

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

        <button style={primaryBtn}>Create Account</button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  height: "52px",
  marginBottom: "18px",
  borderRadius: "999px",
  border: "none",
  padding: "0 18px"
};

const primaryBtn = {
  width: "100%",
  height: "52px",
  borderRadius: "999px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 600
};

export default Register;
