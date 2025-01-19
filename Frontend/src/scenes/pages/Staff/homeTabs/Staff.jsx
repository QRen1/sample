import React, { useState } from "react";
import DropFileInput from "../component/firebaseUpload/components/DropFileInput";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../firebase";
import ServicesUpload from "../component/firebaseUpload/components/ServicesUpload";
import StyleUpload from "../component/firebaseUpload/components/StyleUpload";
import CategoryUpload from "../component/firebaseUpload/components/CategoryUpload";
import AboutCategory from "../component/firebaseUpload/components/AboutCategory";
import StaffComponent from "../component/firebaseUpload/components/staffComponent";
function Staff() {
  const [activeTab, setActiveTab] = useState("profile");
  const [progress, setProgress] = useState(0);

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceFile, setServiceFile] = useState(null);

  // const onFileChange = (files) => {
  //   const currentFile = files[0];
  //   setServiceFile(currentFile);
  //   console.log("Selected file: ", currentFile);
  // };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!serviceFile) {
  //     console.error("No file selected for upload.");
  //     return;
  //   }

  //   const fileRef = ref(storage, `services/${serviceFile.name}`);
  //   const uploadTask = uploadBytesResumable(fileRef, serviceFile);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress = Math.trunc(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setProgress(progress);
  //       console.log("Upload progress: ", progress);
  //     },
  //     (error) => {
  //       console.error("Upload error: ", error);
  //     },
  //     async () => {
  //       // Retrieve the download URL once upload completes
  //       const downloadURL = await getDownloadURL(fileRef);
  //       console.log("File available at: ", downloadURL);

  //       // Prepare service details
  //       const serviceDetails = {
  //         serviceName,
  //         serviceDescription,
  //         servicePrice,
  //         serviceCategory,
  //         serviceFile: {
  //           name: serviceFile.name,
  //           size: serviceFile.size,
  //           type: serviceFile.type,
  //           url: downloadURL,
  //         },
  //       };

  //       // Submit to backend
  //       try {
  //         const response = await fetch(
  //           "http://localhost:8000/api/services/create",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(serviceDetails),
  //           }
  //         );

  //         if (response.ok) {
  //           console.log("Service successfully created");
  //           // Reset form after successful submission
  //           setServiceName("");
  //           setServiceDescription("");
  //           setServicePrice("");
  //           setServiceCategory("");
  //           setServiceFile(null);
  //           setProgress(0);
  //           window.location.reload();
  //         } else {
  //           console.error("Failed to create service:", await response.text());
  //         }
  //       } catch (error) {
  //         console.error("Error submitting service to backend:", error);
  //       }
  //     }
  //   );
  // };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => handleTabClick("profile")}
          className={`px-4 py-2 text-lg font-semibold w-1/2 text-center ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-700"
          }`}
        >
          Staff Profile
        </button>
        <button
          onClick={() => handleTabClick("upload")}
          className={`px-4 py-2 text-lg font-semibold w-1/2 text-center ${
            activeTab === "upload"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-700"
          }`}
        >
          Upload
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="tab-content">
          <StaffComponent />
        </div>
      )}

      {activeTab === "upload" && (
        // <div className="tab-content">
        //   <p className="text-gray-600 mb-6 text-center">
        //     Upload files or videos for the services you offer to clients.
        //   </p>
        //   <form onSubmit={handleFormSubmit} className="space-y-4">
        //     <div className="flex flex-col">
        //       <label
        //         htmlFor="serviceCategory"
        //         className="block text-gray-700 text-lg font-medium"
        //       >
        //         Service Category
        //       </label>
        //       <input
        //         id="serviceCategory"
        //         type="text"
        //         className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        //         value={serviceCategory}
        //         onChange={(e) => setServiceCategory(e.target.value)}
        //         required
        //       />
        //     </div>
        //     {/* Service Name */}
        //     <div className="flex flex-col">
        //       <label
        //         htmlFor="serviceName"
        //         className="block text-gray-700 text-lg font-medium"
        //       >
        //         Service Name
        //       </label>
        //       <input
        //         id="serviceName"
        //         type="text"
        //         className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        //         value={serviceName}
        //         onChange={(e) => setServiceName(e.target.value)}
        //         required
        //       />
        //     </div>

        //     {/* Service Description */}
        //     <div className="flex flex-col">
        //       <label
        //         htmlFor="serviceDescription"
        //         className="block text-gray-700 text-lg font-medium"
        //       >
        //         Service Description
        //       </label>
        //       <textarea
        //         id="serviceDescription"
        //         className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        //         rows="4"
        //         value={serviceDescription}
        //         onChange={(e) => setServiceDescription(e.target.value)}
        //         required
        //       />
        //     </div>

        //     {/* Service Price */}
        //     <div className="flex flex-col">
        //       <label
        //         htmlFor="servicePrice"
        //         className="block text-gray-700 text-lg font-medium"
        //       >
        //         Service Price ($)
        //       </label>
        //       <input
        //         id="servicePrice"
        //         type="number"
        //         className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        //         value={servicePrice}
        //         onChange={(e) => setServicePrice(e.target.value)}
        //         required
        //       />
        //     </div>

        //     {/* File Upload */}
        //     <div>
        //       <DropFileInput onFileChange={onFileChange} />
        //       {progress > 0 && <p>Upload Progress: {progress}%</p>}
        //     </div>

        //     {/* Submit Button */}
        //     <button
        //       type="submit"
        //       className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        //     >
        //       Submit Service
        //     </button>
        //   </form>
        // </div>
        <div className="flex flex-col fourthh:grid fourthh:grid-cols-2 gap-2">
          <ServicesUpload />
          <StyleUpload />
          <CategoryUpload />
          <AboutCategory />
        </div>
      )}
    </div>
  );
}

export default Staff;
