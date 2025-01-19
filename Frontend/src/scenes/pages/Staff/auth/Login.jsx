import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAdminLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if AdminToken is already in localStorage when the component mounts
  useEffect(() => {
    const adminToken = localStorage.getItem("AdminToken");

    if (adminToken) {
      // If AdminToken is found, redirect to the admin dashboard
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://madonna-backend.onrender.com/api/staff/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    // Debugging: log the response data to verify the structure
    console.log("Login response data:", data);

    if (response.ok) {
      // Ensure that AdminToken exists in the response and is saved to localStorage
      if (data.AdminToken) {
        localStorage.setItem("AdminToken", data.AdminToken);
        console.log("AdminToken saved to localStorage:", data.AdminToken);
      } else {
        console.log("AdminToken not found in response:", data);
      }

      // Optionally, store other tokens (access token, refresh token)
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Update login state
      setIsAdminLoggedIn(true);

      // Redirect to the admin dashboard after successful login
      navigate("/admin/dashboard");
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
