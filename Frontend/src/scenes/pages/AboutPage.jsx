import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { aboutUs, aboutDescription, slogan, services } from "../../index.js";
import model from "../../assets/model.jpg";
import Footer from "../../component/footer.jsx";

function AboutPage() {
  const [styles, setStyles] = useState([]);
  const [dateTimeAvailability, setDateTimeAvailability] = useState({});
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    headerImage: "",
    logoImage: null,
    descriptions: ["", "", ""],
    colors: ["", ""],
    mapsLink: "",
    aboutDescription: "",
  });
  const [availability, setAvailability] = useState({
    monday: { status: "available", start: "", end: "" },
    tuesday: { status: "available", start: "", end: "" },
    wednesday: { status: "available", start: "", end: "" },
    thursday: { status: "available", start: "", end: "" },
    friday: { status: "available", start: "", end: "" },
    saturday: { status: "available", start: "", end: "" },
    sunday: { status: "available", start: "", end: "" },
  });
  const [specificDateAvailability, setSpecificDateAvailability] = useState([]);
  const [id, setId] = useState(null);
  const loadAvailability = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/availabilities/availability/get"
      );
      const data = response.data;
      if (data?.availability) {
        const { weeklyAvailability, specificDateAvailability, id } =
          data.availability;

        // Update state with fetched data
        setAvailability((prevState) => {
          const updatedAvailability = {
            ...prevState,
            ...weeklyAvailability,
          };

          // Log start and end times for debugging
          Object.keys(updatedAvailability).forEach((day) => {
            const { start, end } = updatedAvailability[day];
            console.log(`${day} - Start: ${start}, End: ${end}`);
          });

          return updatedAvailability;
        });

        setDateTimeAvailability(specificDateAvailability?.slots || {});
        setId(id);
      }
    } catch (err) {
      console.error("Error fetching availability", err);
      toast.error("Failed to load availability.");
    }
  };
  useEffect(() => {
    loadAvailability();
  }, []);
  // Fetch styles
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/styles/get");
        const data = await response.json();
        if (response.ok) {
          setStyles(data);
          console.log("Fetched Styles:", data);

          if (data.length > 0) {
            const style = data[0];
            setFormData({
              headerImage: style.headerImage,
              logoImage: style.logoImage,
              aboutDescription: style.aboutDescription || "",
              descriptions: style.descriptions || ["", "", ""],
              colors: style.colors || ["", ""],
              mapsLink: style.mapsLink || "",
            });
          }
        } else {
          console.error("Failed to fetch styles.");
        }
      } catch (error) {
        console.error("Error fetching styles:", error);
      }
    };

    fetchStyles();
  }, []); // Empty dependency array ensures it runs only once

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/categories/get"
        );
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
          console.log("Fetched categories:", data.categories);
        } else {
          console.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures it runs only once

  // Load Elfsight script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      console.log("Elfsight widget script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const convertTo12HourFormat = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  return (
    <div className="mt-[50px] fourth:mt-[120px] flex flex-col w-full">
      {/* About Us Section */}
      {aboutUs.map((item, index) => (
        <section
          key={index}
          className="flex flex-col fourthh:grid fourthh:grid-cols-2"
        >
          <div className="flex flex-col gap-2 pt-[15px]">
            <div className="flex flex-col px-3 fifthhh:text-center fourthh:text-right">
              <header className="font-bold tracking-[1px] uppercase text-[35px] fifthhh:text-[50px]">
                {item.Header}
              </header>
              <p className="text-[15px] fifthhh:text-[20px] text-wrap">
                {formData.aboutDescription}
              </p>
            </div>
          </div>
          <img
            src={formData.headerImage.url}
            className="border border-black h-[250px] object-cover mt-5 w-[95%] m-auto fifthhh:h-[400px]"
            style={{
              borderBottomLeftRadius: "255px 15px",
              borderBottomRightRadius: "15px 225px",
              borderTopLeftRadius: "255px 15px",
              borderTopRightRadius: "225px 15px",
              maxWidth: "100%",
            }}
            alt={item.Header || "About Us Image"}
          />
        </section>
      ))}

      {/* About Description */}
      <div className="w-full p-2 mt-3 fourthh:mt-[50px]">
        <header className="text-center font-bold text-[25px]">
          When are we Available:
        </header>
        <div className="flex gap-4 mt-4 flex-col fifthh:grid fifthh:grid-cols-2 fourthh:grid-cols-3">
          {/* Weekly Availability */}
          {Object.entries(availability).map(([day, details]) => (
            <div key={day} className="flex flex-col items-center p-2">
              {/* Day Name */}
              <h2
                className="font-semibold text-[18px] w-full text-center p-2 text-gray-800 uppercase"
                style={{ backgroundColor: formData.colors[0] }}
              >
                {day}
              </h2>
              {/* Availability Info */}
              {details.status === "available" ? (
                <div className="flex gap-1 mt-2 w-full">
                  {/* Start Time */}
                  <div className="flex flex-col items-center p-2 rounded-lg bg-red-200 shadow-md w-full">
                    <span className="text-sm font-medium text-gray-700">
                      Start
                    </span>
                    <span className="text-lg font-bold text-gray-700 ">
                      {convertTo12HourFormat(details.start)}
                    </span>
                  </div>

                  {/* End Time */}
                  <div className="flex flex-col items-center p-2 rounded-lg bg-pink-200 shadow-md w-full">
                    <span className="text-sm font-medium text-gray-700">
                      End
                    </span>
                    <span className="text-lg font-bold text-gray-700 ">
                      {convertTo12HourFormat(details.end)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className=" mt-2 text-center items-center p-2 rounded-lg bg-red-200 shadow-md w-full">
                  <p className="text-sm font-medium text-gray-700">
                    Unavailable
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Services */}
      <div className="mt-[10px] mb-2">
        <header className="w-full text-center text-[25px] fifthh:text-[35px] mb-2">
          What we offer:
        </header>
        <div className="grid grid-cols-2 fourthh:grid-cols-3 gap-1 gap-y-2 mx-1 third:grid-cols-4">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="flex flex-col place-items-center gap-2"
            >
              <section>
                <header className="text-[20px]">
                  {category.serviceCategory}
                </header>
              </section>
              <section className="max-h-[200px] third:max-h-[450px] w-full">
                <img
                  src={category.serviceFile.url}
                  alt={category.serviceCategory || "Service image"}
                  className="w-full h-full object-cover border border-red-500"
                />
              </section>
              <section className="px-1 w-full text-wrap">
                {formData.aboutDescription}
              </section>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2  ">
        <h1 className="text-[40px] mt-5 third:text-[50px] text-center">
          Where to find us:{" "}
        </h1>
        <iframe
          src={formData.mapsLink}
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map Location"
          className="w-full h-[400px]"
        ></iframe>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
