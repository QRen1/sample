import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Assuming you're using toast notifications

const IdkComponent = () => {
  const [formData, setFormData] = useState({
    headerImage: { url: "" },
    // Other data...
  });

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/styles/get");
        const data = await response.json();
        if (response.ok) {
          if (data.length > 0) {
            const style = data[0];
            setFormData({
              headerImage: { url: style.headerImage?.url || "" },
              // Set other fields from the API data...
            });

            // Update favicon dynamically based on the formData.headerImage.url
            const favicon = document.getElementById("dynamic-favicon");
            if (favicon && style.headerImage?.url) {
              favicon.href = style.headerImage.url; // Replace with the new URL from the API
            }
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
  }, []); // Empty dependency array ensures this runs once after component mounts

  return <div id="root"></div>;
};

export default IdkComponent;
