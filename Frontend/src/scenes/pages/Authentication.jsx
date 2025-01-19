import React, { useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";

function Authentication({ setIsLoggedIn }) {
  const [activeTab, setActiveTab] = useState("login"); // Track active tab (login or register)

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#fcdebe]">
      <div className="w-full mx-4 fifthh:mx-0 max-w-md rounded-lg bg-white p-8 shadow-xl">
        {activeTab === "login" ? (
          <div>
            <Login setIsLoggedIn={setIsLoggedIn} />{" "}
            {/* Pass setIsLoggedIn here */}
            <div className="mt-4 flex items-center justify-center gap-3 text-center">
              <p>Don't have an account? </p>
              <h1
                className="cursor-pointer text-[#fd5564]"
                onClick={() => handleTabClick("register")}
              >
                Register
              </h1>
            </div>
          </div>
        ) : (
          <div>
            <Register />
            <div className="mt-4 flex justify-center gap-3 text-center">
              <p>Already have an account?</p>
              <h1
                className="cursor-pointer text-[#fd5564]"
                onClick={() => handleTabClick("login")}
              >
                Login
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Authentication;
