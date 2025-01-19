import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if AdminToken is already in localStorage when the component mounts
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      // If AdminToken is found, redirect to the admin dashboard
      navigate("/");
    }
  }, [navigate]); // Only run once when the component mounts

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://madonna-backend.onrender.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Save the AdminToken and other tokens to localStorage if present
      if (data.AdminToken) {
        localStorage.setItem("AdminToken", data.AdminToken);
      }
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Update the login state
      setIsLoggedIn(true); // This updates the state passed from the parent

      // Redirect to the admin dashboard
      navigate("/");
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#fcdebe]">
      <div className="w-full max-w-md bg-white rounded-lg ">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
