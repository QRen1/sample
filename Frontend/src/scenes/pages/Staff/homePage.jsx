import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaUser,
} from "react-icons/fa";

import Dashboard from "./homeTabs/Dashboard";
import Appointments from "./homeTabs/Appointments";
import Staff from "./homeTabs/Staff";
import Register from "../../pages/Staff/auth/Register";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state
  const [activeTab, setActiveTab] = useState("Dashboard"); // Active tab state
  const [profile, setProfile] = useState(null);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("AdminToken");

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/staff/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("User profile data:", data); // Log the user's profile data
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login
    navigate("/admin/auth");
  };

  const tabItems = [
    {
      title: "Dashboard",
      content: <Dashboard />,
      icon: <FaTachometerAlt />,
    },
    {
      title: "Appointments",
      content: <Appointments />,
      icon: <FaCalendarAlt />,
    },

    {
      title: "Staff",
      content: <Staff />,
      icon: <FaUsers />,
    },
    ...(profile?.status === "admin"
      ? [
          {
            title: "Admin",
            content: <Register />,
            icon: <FaUser />,
          },
        ]
      : []), // Only include the "Admin" tab if the user has ADMIN status
  ];

  return (
    <>
      {profile?.status === "none" ? (
        <div className="flex min-h-full w-full items-center justify-center bg-[#fcdebe]">
          <div className="flex flex-col min-w-[300px] p-5 items-center gap-2">
            <section className="text-gray-500 text-[25px] fifthhh:text-[50px] p-3 fifthhh:p-5 bg-white shadow-lg rounded-lg">
              Waiting for Admin Approval ...
            </section>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500 shadow-lg rounded-lg w-full text-[20px] fifthhh:text-[30px] fifthhh:p-4 text-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="fifthh:flex fifthh:h-[100vh] w-full">
            {/* Sidebar */}
            <div className="flex gap-2 w-full fifthh:hidden">
              <div className="flex items-start flex-grow">
                {tabItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center text-center p-4 hover:bg-gray-700 cursor-pointer h-[50px] w-full ${
                      activeTab === item.title ? "bg-gray-400" : ""
                    }`}
                    onClick={() => setActiveTab(item.title)}
                  >
                    <div className="m-auto">{item.icon}</div>
                  </div>
                ))}

                {/* Logout Option */}
                <div
                  className="flex items-center p-4 hover:bg-gray-700 cursor-pointer h-[50px] w-full"
                  onClick={handleLogout}
                >
                  <div className="mr-4">
                    <FaSignOutAlt size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`transition-width duration-300 bg-gray-800 text-white sticky top-0 hidden fifthh:flex ${
                isOpen ? "w-64" : "w-16"
              } flex flex-col`}
            >
              {/* Toggle Button */}
              <div
                className="p-4 cursor-pointer transition ease-in-out duration-300"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click propagation to other elements
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? <FaBarsStaggered size={20} /> : <FaBars size={20} />}
              </div>

              {/* Sidebar Menu */}
              <div className="flex flex-col items-start flex-grow">
                {tabItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer h-[50px] w-full ${
                      activeTab === item.title ? "bg-gray-600" : ""
                    }`}
                    onClick={() => setActiveTab(item.title)}
                  >
                    <div className="mr-4">{item.icon}</div>
                    {isOpen && <span>{item.title}</span>}
                  </div>
                ))}

                {/* Logout Option */}
                <div
                  className="flex items-center p-4 hover:bg-gray-700 cursor-pointer h-[50px] w-full"
                  onClick={handleLogout}
                >
                  <div className="mr-4">
                    <FaSignOutAlt size={20} />
                  </div>
                  {isOpen && <span>Logout</span>}
                </div>
              </div>
            </div>
            <div className="text-white sticky top-0 "></div>
            {/* Main Content */}
            <main className="p-4 flex-1 overflow-auto">
              <p>
                {tabItems.find((item) => item.title === activeTab)?.content ||
                  "Select a tab to view its content."}
              </p>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
