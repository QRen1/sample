import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Example: Check if user is logged in by reading a token or session
    const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve user info from local storage or cookies
    if (storedUser) {
      setUser(storedUser); // Set the user in state
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Save user to local storage
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user"); // Clear user from local storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
