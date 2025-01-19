import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./scenes/nav";
import LandingPage from "./scenes/pages/LandingPage.jsx";
import ServicesPage from "./scenes/pages/ServicesPage.jsx";
import AboutPage from "./scenes/pages/AboutPage.jsx";
import ContactPage from "./scenes/pages/ContactPage.jsx";
import Authentication from "./scenes/pages/Authentication.jsx";
import Profile from "./scenes/pages/Profile.jsx";
import HomePage from "./scenes/pages/Staff/homePage.jsx";
import AdminAuthentication from "./scenes/pages/Staff/AdminAuthentication.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("AdminToken");
    console.log("Token from localStorage:", token);
    console.log("AdminToken from localStorage:", adminToken);

    setIsLoggedIn(!!token); // Update login state based on token presence
    setIsAdminLoggedIn(!!adminToken); // Update admin login state based on AdminToken presence
  }, []);

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />
    </Router>
  );
}

function AppContent({
  isLoggedIn,
  setIsLoggedIn,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div className="app">
      {/* Conditionally render Navbar based on current route */}
      {!isAuthPage && !isAdminPage && <Navbar isLoggedIn={isLoggedIn} />}
      <Routes>
        {/* Admin page route */}
        <Route
          path="/admin/dashboard"
          element={
            isAdminLoggedIn ? <HomePage /> : <Navigate to="/admin/auth" />
          }
        />

        {/* Regular app routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/services"
          element={<ServicesPage isLoggedIn={isLoggedIn} />}
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        <Route
          path="/auth"
          element={<Authentication setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/admin/auth"
          element={
            <AdminAuthentication setIsAdminLoggedIn={setIsAdminLoggedIn} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
