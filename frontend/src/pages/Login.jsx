import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const userData = response.data;

      localStorage.setItem("facultyUser", JSON.stringify(userData));

      const role = (userData.role || "").toLowerCase();

      alert("Login successful");

      if (role === "admin" || role === "ttio" || role === "staff") {
        navigate("/dashboard");
      } else {
        navigate("/faculty-portal");
      }
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 90px)",
        background: "#f5f6f8",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 0.9fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "#111111",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "34px",
          }}
        >
          <div
            style={{
              background: "#222222",
              color: "#f2c300",
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              marginBottom: "14px",
            }}
          >
            BOWIE STATE UNIVERSITY TTIO
          </div>

          <h1
            style={{
              fontSize: "34px",
              fontWeight: "800",
              marginBottom: "14px",
              lineHeight: "1.2",
            }}
          >
            Technology Transfer & Innovation Office Platform
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#cccccc",
              lineHeight: "1.7",
              marginBottom: "22px",
            }}
          >
            Access the TTIO platform to support invention disclosures,
            document submission, innovation review, and workflow tracking.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "34px",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              background: "#fff7d6",
              color: "#8a6a00",
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            SECURE LOGIN
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: "800" }}>
            Sign in to the TTIO platform
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                background: "#f2c300",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;