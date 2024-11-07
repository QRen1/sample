import React, { useEffect, useState } from "react";
// import logo from "../../src/assets/logo.svg";
import "../styles/nav.css";

function Navbar() {
  const [isToggled, setIsToggled] = useState(false);
  const [finalOpacity, setFinalOpacity] = useState(0); // Start with opacity 0

  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  const menuItems = [
    { name: "ABOUT", href: "#" },
    { name: "SERVICES", href: "#" },
    { name: "CONTACT", href: "#" },
    { name: "SOCIALS", href: "#" },
    { name: "HOME", href: "#" },
  ];

  useEffect(() => {
    if (isToggled) {
      // Set opacity to 1 after a delay based on the number of items
      const timeout = setTimeout(() => {
        setFinalOpacity(1);
      }, menuItems.length * 5); // Total delay for all items

      return () => clearTimeout(timeout);
    } else {
      setFinalOpacity(0); // Reset opacity when toggled off
    }
  }, [isToggled]);
  return (
    <div className="container">
      <div className="fixed top-0 z-50 hidden h-[120px] w-full justify-between bg-[white] px-10 text-center fourth:flex">
        <div className="m-2 flex h-[100px] w-[200px] items-center p-2 third:h-[120px] third:w-[220px]">
          {/* <img src={logo} alt="Madonna Aesthetics" className="h-[100px]" /> */}
        </div>
        <ul className="flex items-center justify-around text-[20px] fourth:gap-[60px] third:gap-[80px] first:gap-[100px]">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* ============= MOBILE ====================== */}

      <div className="fixed top-0 flex w-full items-center justify-between bg-[white]">
        <div className="m-2 flex h-[100px] w-[200px] items-center p-2 fourth:hidden third:h-[120px] third:w-[220px]">
          {/* <img src={logo} alt="Madonna Aesthetics" className="h-[100px]" /> */}
        </div>
      </div>
      <div className="mobile-icon z-15 fixed right-5 top-5 z-50 transition-all duration-200 ease-in-out fourth:hidden">
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
      {isToggled ? (
        <div
          className={`fourth fixed h-full w-full bg-[white] transition-all duration-200 ease-in-out top-0${
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
                <a href={item.href}>{item.name}</a>
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
