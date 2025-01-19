import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigate for redirection

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Default status
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Simple client-side validation
    if (!fullName || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/staff/register",
        {
          fullName,
          email,
          password,
          status: status || "none", // Ensure "staff" as default
        }
      );

      const { AdminToken } = response.data;

      if (AdminToken) {
        console.log("Registration successful, token:", AdminToken); // Log token to console

        // Save the token only if you want auto-login
        // localStorage.setItem("AdminToken", AdminToken);

        setSuccess("Registration successful! You can now log in.");
        setFullName("");
        setEmail("");
        setPassword("");
        setStatus("");

        // Redirect to login page
      } else {
        setError("Failed to get token from the server.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.log("Error Response:", err.response); // Log the full error response

      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-lg p-6 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Staff Registration
        </h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">{success}</div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 text-white font-bold rounded-lg ${
            loading ? "bg-gray-500" : "bg-indigo-500 hover:bg-indigo-600"
          } focus:outline-none focus:ring`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
