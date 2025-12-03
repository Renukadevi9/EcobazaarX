import React, { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated authentication (demo users)
    const isValid =
      (role === "User" && username === "user" && password === "1234") ||
      (role === "Seller" && username === "seller" && password === "abcd") ||
      (role === "Admin" && username === "admin" && password === "admin");

    if (isValid) {
      alert(`✅ Welcome ${role}!`);
      onLoginSuccess(role); // Trigger success callback in App.js
    } else {
      alert("❌ Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login to EcoBazaar</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Seller">Seller</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>

      <div className="hint">
        <p><b>Demo Accounts:</b></p>
        <ul>
          <li>User → <b>user</b> / <b>1234</b></li>
          <li>Seller → <b>seller</b> / <b>abcd</b></li>
          <li>Admin → <b>admin</b> / <b>admin</b></li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
