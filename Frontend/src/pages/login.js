import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting login...");

      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAuthToken(data.token); // ✅ Save JWT token in localStorage
      console.log("Token saved:", localStorage.getItem("token"));

      navigate("/canvases"); // ✅ Redirect after token is stored
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
