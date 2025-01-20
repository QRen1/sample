import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../src/assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";

import "../styles/nav.css";

function Navbar({ isLoggedIn }) {
  const [isToggled, setIsToggled] = useState(false);
  const [finalOpacity, setFinalOpacity] = useState(0); // Start with opacity 0
  const [formData, setFormData] = useState({
    logoImage: "",
  });
  const [styles, setStyles] = useState([]);

  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  // Dynamically set menu items
  const menuItems = [
    { name: "HOME", to: "/" },
    { name: "SERVICES", to: "/services" },
    { name: "ABOUT", to: "/about" },

    {
      name: isLoggedIn ? "PROFILE" : "LOGIN",
      to: isLoggedIn ? "/profile" : "/auth",
    }, // Conditionally change LOGIN to PROFILE
  ];

  console.log(isLoggedIn); // Log the value of isLoggedIn to check if it's correct

  useEffect(() => {
    if (isToggled) {
      const timeout = setTimeout(() => {
        setFinalOpacity(1);
      }, menuItems.length * 5); // Total delay for all items

      return () => clearTimeout(timeout);
    } else {
      setFinalOpacity(0); // Reset opacity when toggled off
    }
  }, [isToggled]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/styles/get"
        );
        const data = await response.json();
        if (response.ok) {
          setStyles(data);
          console.log("Fetched Styles:", data);

          if (data.length > 0) {
            const style = data[0];
            setFormData({
              logoImage: style.logoImage,
            });
          }
        } else {
          toast.error("Failed to fetch styles.");
        }
      } catch (error) {
        console.error("Error fetching styles:", error);
        toast.error("An error occurred while fetching styles.");
      }
    };

    fetchStyles();
  }, []);

  return (
    <div className="container">
      {/* ============ Desktop Navbar ============ */}
      <div className="fixed top-0 z-[500] hidden h-[120px] w-full justify-between bg-[white] px-10 text-center fourth:flex">
        <div className=" flex h-[100px] w-[200px] items-center p-2 third:h-[120px] third:w-[220px]">
          <Link to="/">
            {" "}
            <img
              src={formData.logoImage?.url}
              alt="Madonna || Aesthetics Logo"
              className="m-auto max-h-[100px]"
            />{" "}
          </Link>
        </div>
        <ul className="flex items-center justify-around text-[20px] fourth:gap-[60px] third:gap-[80px] first:gap-[100px]">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ============ Mobile Navbar ============ */}
      <div className="fixed fourth:hidden flex top-0 w-full h-[50px] items-center justify-between bg-[white] z-[500]">
        <div className="m-2 flex h-[100px] w-[200px] items-center p-2 fourth:hidden third:h-[120px] third:w-[220px]">
          {/* <img src={logo} alt="Madonna Aesthetics" className="h-[100px]" /> */}
        </div>
      </div>
      <div className="mobile-icon z-15 fixed right-5 top-2 z-[10000] transition-all duration-200 ease-in-out fourth:hidden">
        {!isToggled ? (
          <button onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        ) : (
          <button onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isToggled ? (
        <div
          className={`fourth fixed h-full w-full bg-[white] transition-all duration-200 ease-in-out top-0 z-[1000] ${
            isToggled ? "right-0 top-0" : "top-30 right-10"
          }`}
        >
          <ul className="flex h-full w-full flex-col items-center justify-center">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex h-full w-full items-center justify-center border-b text-center transition-opacity duration-300`}
                style={{
                  opacity: finalOpacity,
                  transitionDelay: `${index * 5}ms`, // Delay for each item
                  borderColor: finalOpacity ? "black" : "transparent", // Change border color based on opacity
                  color: finalOpacity ? "black" : "transparent", // Change text color based on opacity
                }}
              >
                <Link to={item.to} onClick={toggleMenu}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="not-toggled fourth:hidden"></div>
      )}
    </div>
  );
}

export default Navbar;
