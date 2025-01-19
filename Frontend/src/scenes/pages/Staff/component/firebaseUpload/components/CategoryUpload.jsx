import React, { useState, useEffect } from "react";
import DropFileInput from "./DropFileInput"; // Import your custom file upload component
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../../../firebase"; // Import your Firebase storage instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

const CategoryUpload = () => {
  const [formData, setFormData] = useState({
    serviceCategory: "",
    serviceDescription: "",
    serviceFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/categories/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories); // Extract the array of categories
        console.log("Fetched categories:", data.categories); // Log the extracted categories array
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      setFormData({ ...formData, serviceFile: files[0] });
    } else {
      setFormData({ ...formData, serviceFile: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceFile) {
      toast.error("Please upload a file.");
      return;
    }

    setIsUploading(true);
    const file = formData.serviceFile;
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Update progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        // Handle upload errors
        console.error("Upload error:", error);
        toast.error("File upload failed. Please try again.");
        setIsUploading(false);
      },
      async () => {
        // Upload complete, get download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Send form data to the server
          const response = await fetch(
            "https://madonna-backend.onrender.com/api/categories/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                serviceCategory: formData.serviceCategory,
                serviceDescription: formData.serviceDescription,
                serviceFile: {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: downloadURL,
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload category.");
          }

          toast.success("Category uploaded successfully!");
          setFormData({
            serviceCategory: "",
            serviceDescription: "",
            serviceFile: null,
          });
          setUploadProgress(0);

          // Refresh categories after successful upload
          const fetchCategories = async () => {
            const res = await fetch(
              "https://madonna-backend.onrender.com/api/categories"
            );
            const data = await res.json();
            setCategories(data);
          };
          fetchCategories();
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("Failed to upload category. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  const deleteCategory = async (categoryId) => {
    if (!categoryId) {
      console.error("Category ID is undefined!");
      toast.error("Invalid category ID.");
      return;
    }

    try {
      const response = await fetch(
        `https://madonna-backend.onrender.com/api/categories/delete/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category.");
      }

      toast.success("Category deleted successfully!");

      // Remove the category from the local state
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-lg p-2 border border-black h-[850px] rounded-lg overflow-x-scroll scrollbar-hide">
      <ToastContainer />
      <h2 className="text-lg font-semibold text-gray-800 text-center">
        Upload Categories
      </h2>
      <p className="text-gray-600 mt-2 text-center text-[15px]">
        Fill out the form below to upload a new category.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Service Category
          </label>
          <input
            type="text"
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter service category"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Service Description
          </label>
          <textarea
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter service description"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Service File
          </label>
          <DropFileInput onFileChange={handleFileChange} />
        </div>
        {isUploading && (
          <div className="mb-4">
            <p className="text-blue-600 font-medium">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
        <button
          type="submit"
          className={`${
            isUploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 w-full"
          } text-white py-2 px-4 rounded-lg`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Category"}
        </button>
      </form>

      <section className="w-full border border-gray-400 my-10"></section>
      <div className="flex flex-col mt-5 gap-2">
        <header className="text-[24px] text-center">Existing Categories</header>
        <div className="grid grid-cols-2 gap-2">
          {categories.length === 0 ? (
            <p className="text-center text-gray-600">No categories found.</p>
          ) : (
            categories.map((category, index) => (
              <div
                key={index}
                className=" p-4 rounded-lg mt-2 shadow-md border"
              >
                <h3 className="font-semibold text-gray-800">
                  {category.serviceCategory}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.serviceDescription}
                </p>
                {category.serviceFile?.url && (
                  <img
                    src={category.serviceFile.url}
                    alt={category.serviceCategory}
                    className="w-full h-[150px] object-cover mt-2"
                  />
                )}
                <button
                  onClick={() => {
                    console.log("Deleting category with _id:", category._id); // Log _id for debugging
                    deleteCategory(category._id); // Use _id here
                  }}
                  className="mt-2 text-white hover:text-red-800 w-full bg-red-600"
                  disabled={!category._id} // Disable button if there's no category _id
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryUpload;
