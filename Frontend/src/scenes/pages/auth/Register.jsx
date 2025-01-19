// Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message on form submit

    try {
      const response = await axios.post(
        "https://madonna-backend.onrender.com/auth/register",
        {
          fullName,
          email,
          password,
        }
      );

      const { token } = response.data;

      if (token) {
        console.log("Registration successful, token:", token); // Log token to console

        localStorage.setItem("accessToken", token);

        console.log(
          "Token saved to localStorage:",
          localStorage.getItem("accessToken")
        ); // Debugging step

        alert("Registration successful");

        // Redirect to profile page
        navigate("/");
      }
    } catch (err) {
      console.error("Error during registration:", err); // Log full error
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-md py-6 bg-white rounded-lg">
      <h2 className="mb-6 text-center text-3xl font-semibold">Register</h2>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
