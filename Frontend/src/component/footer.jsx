import React, { useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailIcon from "@mui/icons-material/Mail";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

function Footer() {
  const [styles, setStyles] = useState([]);
  const [formData, setFormData] = useState({
    headerImage: "",
    logoImage: "",
    descriptions: ["", "", ""],
    colors: ["", ""],
    mapsLink: "",
    contactNumber: "",
    email: "",
    instagram: "",
    facebook: "",
    aboutDescription: "",
  });

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/styles/get");
        const data = await response.json();
        if (response.ok) {
          setStyles(data);

          if (data.length > 0) {
            const style = data[0];
            setFormData({
              headerImage: style.headerImage,
              logoImage: style.logoImage,
              descriptions: style.descriptions || ["", "", ""],
              colors: style.colors || ["", ""],
              mapsLink: style.mapsLink || "",
              contactNumber: style.contactNumber || "",
              email: style.email || "",
              instagram: style.instagram || "",
              facebook: style.facebook || "",
              aboutDescription: style.aboutDescription || "",
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

  const category = [
    {
      category: "CONNECT",
      content: [
        {
          icon: <PhoneOutlinedIcon />,
          text: formData.contactNumber,
          link: `tel:${formData.contactNumber}`,
        },
        {
          icon: <MailIcon />,
          text: formData.email,
          link: `mailto:${formData.email}`,
        },

        {
          icon: <FacebookRoundedIcon />,
          text: formData.facebook,
          link: `https://www.facebook.com/${formData.facebook}`,
        },
      ],
    },
  ];
  const menuItems = [
    { name: "HOME", to: "/" },
    { name: "SERVICES", to: "/services" },
    { name: "ABOUT", to: "/about" },
  ];
  return (
    <div className="footer flex flex-col w-full">
      {/* Copyright Section */}
      <section className="w-full text-center flex items-center justify-center gap-2 bg-[#f9cc9e]">
        <CopyrightIcon fontSize="small" /> <h1>2024, Japan</h1>
      </section>

      {/* Main Footer Content */}
    </div>
  );
}

export default Footer;
