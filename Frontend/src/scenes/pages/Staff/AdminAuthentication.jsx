// AdminAuthentication.jsx
import React, { useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";

function AdminAuthentication({ setIsAdminLoggedIn }) {
  const [isAdminLogin, setIsAdminLogin] = useState(true); // State to toggle between Login and Register

  return (
    <div className="mx-auto p-6 flex justify-center items-center h-screen bg-gray-100 w-full">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <Login setIsAdminLoggedIn={setIsAdminLoggedIn} />
      </div>
    </div>
  );
}

export default AdminAuthentication;
