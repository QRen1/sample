import React, { useState, useEffect } from "react";
import DropFileInput from "./DropFileInput";
import { storage } from "../../../../../../../firebase";
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";

const StyleUpload = () => {
  const [formData, setFormData] = useState({
    headerImage: null,
    logoImage: null,
    descriptions: ["", "", ""],
    colors: ["", ""],
    mapsLink: "",
    contactNumber: "",
    email: "",
    instagram: "",
    facebook: "",
    aboutDescription: "",
  });
  const [styles, setStyles] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/styles/get"
        );
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

  const handleFileUpload = (file, fieldName, oldFileUrl) => {
    if (!file) return;

    const fileRef = ref(storage, `${fieldName}/${file.name}`);

    if (oldFileUrl) {
      const oldFileRef = ref(storage, oldFileUrl);
      deleteObject(oldFileRef).catch((error) => {
        console.error("Error deleting old file:", error);
      });
    }

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.trunc(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error(`Upload error:`, error);
      },
      () => {
        getDownloadURL(fileRef).then((url) => {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: {
              url,
              type: file.type,
              size: file.size,
              name: file.name,
            },
          }));
        });
      }
    );
  };

  const onFileChange = (files, fieldName) => {
    const file = files[0];
    handleFileUpload(file, fieldName);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {
      headerImage,
      logoImage,
      descriptions,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    } = formData;

    if (!headerImage || !logoImage) {
      toast.error("Please upload both header and logo images.");
      return;
    }

    const styleDetails = {
      headerImage,
      logoImage,
      descriptions,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    };

    try {
      const response = await fetch(
        "https://madonna-backend.onrender.com/api/styles/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(styleDetails),
        }
      );

      if (response.ok) {
        toast.success("Style uploaded successfully!");
        setFormData({
          headerImage: null,
          logoImage: null,
          descriptions: ["", "", ""],
          colors: ["", ""],
          mapsLink: "",
          contactNumber: "",
          email: "",
          instagram: "",
          facebook: "",
          aboutDescription: "",
        });
        setProgress(0);
      } else {
        toast.error("Failed to upload style.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const {
      headerImage,
      logoImage,
      descriptions,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    } = formData;

    if (!headerImage || !logoImage) {
      toast.error("Please upload both header and logo images.");
      return;
    }

    const styleDetails = {
      headerImage,
      logoImage,
      descriptions,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    };

    try {
      const styleId = styles[0]._id;
      const response = await fetch(
        `https://madonna-backend.onrender.com/api/styles/update/${styleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(styleDetails),
        }
      );

      if (response.ok) {
        const updatedStyle = await response.json();
        toast.success(updatedStyle.message);
      } else {
        toast.error("Failed to update style.");
      }
    } catch (error) {
      console.error("Error updating style:", error);
      toast.error("An error occurred while updating style.");
    }
  };
  const isPrepopulated = !!formData.headerImage || !!formData.logoImage;
  return (
    <div className="bg-white shadow-lg p-2 border border-black h-[850px] rounded-lg overflow-x-scroll scrollbar-hide">
      <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
        Upload or Update Style Information
      </h2>
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        {/* Header Image */}
        <div className="flex flex-col">
          <label
            htmlFor="headerImage"
            className="block text-gray-700 text-lg font-medium"
          >
            Header Image
          </label>
          <DropFileInput
            onFileChange={(files) => onFileChange(files, "headerImage")}
          />
          {formData.headerImage?.url && (
            <img
              src={formData.headerImage.url}
              alt="Header"
              className="mt-2 max-w-full h-auto"
            />
          )}
        </div>

        {/* Logo Image */}
        <div className="flex flex-col">
          <label
            htmlFor="logoImage"
            className="block text-gray-700 font-medium text-lg"
          >
            Logo Image
          </label>
          <DropFileInput
            onFileChange={(files) => onFileChange(files, "logoImage")}
          />
          {formData.logoImage?.url && (
            <img
              src={formData.logoImage.url}
              alt="Logo"
              className="mt-2 max-w-full h-auto"
            />
          )}
        </div>

        {/* Descriptions */}
        {[1, 2, 3].map((desc) => (
          <div key={desc} className="flex flex-col">
            <label
              htmlFor={`description${desc}`}
              className="block text-gray-700 text-lg font-medium"
            >
              Description {desc}
            </label>
            <textarea
              id={`description${desc}`}
              rows="2"
              value={formData.descriptions[desc - 1]}
              onChange={(e) => {
                const newDescriptions = [...formData.descriptions];
                newDescriptions[desc - 1] = e.target.value;
                setFormData((prevData) => ({
                  ...prevData,
                  descriptions: newDescriptions,
                }));
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder={`Enter description ${desc}`}
              required
            />
          </div>
        ))}
        {/* About Description */}
        <div className="flex flex-col">
          <label
            htmlFor="aboutDescription"
            className="text-gray-800 text-lg font-medium"
          >
            About Description
          </label>
          <textarea
            id="aboutDescription"
            rows="3"
            value={formData.aboutDescription}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                aboutDescription: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter about description"
            required
          />
        </div>
        {/* Colors */}
        {[1, 2].map((color) => (
          <div key={color} className="flex flex-col">
            <label
              htmlFor={`color${color}`}
              className="text-gray-800 text-sm font-medium mb-1"
            >
              Color {color}
            </label>
            <input
              id={`color${color}`}
              type="text"
              value={formData.colors[color - 1]}
              onChange={(e) => {
                const newColors = [...formData.colors];
                newColors[color - 1] = e.target.value;
                setFormData((prevData) => ({ ...prevData, colors: newColors }));
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="#000000"
              required
            />
          </div>
        ))}

        {/* Maps Link */}
        <div className="flex flex-col">
          <label
            htmlFor="mapsLink"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Maps Link
          </label>
          <input
            id="mapsLink"
            type="text"
            value={formData.mapsLink}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                mapsLink: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Paste Google Maps link"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="flex flex-col">
          <label
            htmlFor="contactNumber"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="text"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                contactNumber: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter contact number"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                email: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Instagram */}
        <div className="flex flex-col">
          <label
            htmlFor="instagram"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Instagram
          </label>
          <input
            id="instagram"
            type="text"
            value={formData.instagram}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                instagram: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Instagram handle"
            required
          />
        </div>

        {/* Facebook */}
        <div className="flex flex-col">
          <label
            htmlFor="facebook"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Facebook
          </label>
          <input
            id="facebook"
            type="text"
            value={formData.facebook}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                facebook: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Facebook URL"
            required
          />
        </div>

        <div className="flex items-center  flex-col gap-2">
          <button
            type="submit"
            disabled={isPrepopulated} // Disabled when prepopulated
            className={`bg-green-500 text-white py-2 px-4 w-full rounded-lg ${
              isPrepopulated ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 w-full rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StyleUpload;
