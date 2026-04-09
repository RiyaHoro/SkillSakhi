import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response);
      alert("Login failed");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-overlay" />
      <div className="login-card">

        <div className="login-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
            <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to your account to continue</p>

        <label className="login-label">Username</label>
        <input
          className="login-input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-forgot-row">
          <a href="#" className="login-forgot-link">Forgot password?</a>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Sign in
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <a href="/register" className="login-footer-link">Create one</a>
        </p>
      </div>
    </div>
  );
}

export default Login;