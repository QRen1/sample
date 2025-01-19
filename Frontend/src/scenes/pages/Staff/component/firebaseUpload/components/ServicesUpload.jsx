import React, { useState, useEffect } from "react";
import DropFileInput from "./DropFileInput"; // Import your custom file upload component
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

const ServicesUpload = () => {
  const [progress, setProgress] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceFile, setServiceFile] = useState(null);
  const [servicesData, setServicesData] = useState([]); // State to hold fetched services

  const onFileChange = (files) => {
    const currentFile = files[0];
    setServiceFile(currentFile);
    console.log("Selected file: ", currentFile);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!serviceFile) {
      console.error("No file selected for upload.");
      return;
    }

    const fileRef = ref(storage, `services/${serviceFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, serviceFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.trunc(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        console.log("Upload progress: ", progress);
      },
      (error) => {
        console.error("Upload error: ", error);
      },
      async () => {
        // Retrieve the download URL once upload completes
        const downloadURL = await getDownloadURL(fileRef);
        console.log("File available at: ", downloadURL);

        // Prepare service details
        const serviceDetails = {
          serviceName,
          serviceDescription,
          servicePrice,
          serviceCategory,
          serviceFile: {
            name: serviceFile.name,
            size: serviceFile.size,
            type: serviceFile.type,
            url: downloadURL,
          },
        };

        // Submit to backend
        try {
          const response = await fetch(
            "https://madonna-backend.onrender.com/api/services/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(serviceDetails),
            }
          );

          if (response.ok) {
            console.log("Service successfully created");
            toast.success("Service uploaded successfully!");

            // Reset form after successful submission
            setServiceName("");
            setServiceDescription("");
            setServicePrice("");
            setServiceCategory("");
            setServiceFile(null);
            setProgress(0);

            // Refresh services list
            fetchServices();
          } else {
            console.error("Failed to create service:", await response.text());
            toast.error("Failed to upload service.");
          }
        } catch (error) {
          console.error("Error submitting service to backend:", error);
          toast.error("An error occurred. Please try again.");
        }
      }
    );
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "https://madonna-backend.onrender.com/api/services/getService"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServicesData(data.services); // Assuming `services` is the property that contains service data
      console.log("Fetched services data:", data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://madonna-backend.onrender.com/api/services/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Service deleted successfully!");
        setServicesData((prevServices) =>
          prevServices.filter((service) => service._id !== id)
        );
      } else {
        console.error("Failed to delete service:", await response.text());
        toast.error("Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="bg-white shadow-lg p-2 border border-black h-[850px] rounded-lg overflow-x-scroll scrollbar-hide">
      <ToastContainer />
      <p className="text-gray-600 mb-6 text-center">
        Upload files or videos for the services you offer to clients.
      </p>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="serviceCategory"
            className="block text-gray-700 text-lg font-medium"
          >
            Service Category
          </label>
          <input
            id="serviceCategory"
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="serviceName"
            className="block text-gray-700 text-lg font-medium"
          >
            Service Name
          </label>
          <input
            id="serviceName"
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="serviceDescription"
            className="block text-gray-700 text-lg font-medium"
          >
            Service Description
          </label>
          <textarea
            id="serviceDescription"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            rows="4"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="servicePrice"
            className="block text-gray-700 text-lg font-medium"
          >
            Service Price ($)
          </label>
          <input
            id="servicePrice"
            type="number"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
            required
          />
        </div>

        <div>
          <DropFileInput onFileChange={onFileChange} />
          {progress > 0 && <p>Upload Progress: {progress}%</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit Service
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          Available Services
        </h2>
        {servicesData.length > 0 ? (
          <ul className="flex flex-col gap-2 fourthh:grid fourthh:grid-cols-2 ">
            {servicesData.map((service) => (
              <li
                key={service._id}
                className="border p-4 flex flex-col gap-2 rounded-md shadow-md"
              >
                <h3 className="text-lg font-semibold text-center">
                  {service.serviceName}
                </h3>
                <p>{service.serviceDescription}</p>
                <p>Price: ¥{service.servicePrice}</p>
                <p>Category: {service.serviceCategory}</p>
                {service.serviceFile && (
                  <img
                    src={service.serviceFile.url}
                    alt={service.serviceName}
                  />
                )}
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete Service
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No services available.</p>
        )}
      </div>
    </div>
  );
};

export default ServicesUpload;
