import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import uploadImg from "../assets/cloud-upload-regular-240.png";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  // Cleanup the object URL when component unmounts
  useEffect(() => {
    // Cleanup the object URLs when component unmounts
    return () => {
      fileList.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [fileList]);

  const onDragEnter = () =>
    wrapperRef.current.classList.add(
      "border-dashed",
      "border-4",
      "border-blue-400"
    );
  const onDragLeave = () =>
    wrapperRef.current.classList.remove(
      "border-dashed",
      "border-4",
      "border-blue-400"
    );
  const onDrop = (e) => {
    e.preventDefault(); // Prevent default drop behavior
    wrapperRef.current.classList.remove(
      "border-dashed",
      "border-4",
      "border-blue-400"
    );
    const newFile = e.dataTransfer.files[0]; // Grab the first dropped file
    if (newFile) {
      const updatedList = [newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList); // Notify parent component about the file change
    }
  };

  const onFileDrop = (e) => {
    e.preventDefault(); // Prevent default behavior
    const newFile = e.target.files[0]; // Get the first selected file
    if (newFile) {
      const updatedList = [newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList); // Notify parent component about the file change
    }
  };

  const fileRemove = (file) => {
    const updatedList = fileList.filter((item) => item !== file); // Remove the file from the list
    setFileList(updatedList);
    props.onFileChange(updatedList); // Notify parent component about the file removal
  };

  // Determine what to show in the preview image
  const previewImage =
    fileList.length > 0
      ? URL.createObjectURL(fileList[0]) // If a file is uploaded, use it as the preview image
      : uploadImg; // Otherwise, show the default upload icon

  return (
    <div className="flex flex-col mx-auto">
      <div
        ref={wrapperRef}
        className="border-4 min-w-[250px] h-[200px] mb-5 mx-auto border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-300 relative"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* File Preview */}
        <div className="inset-0 flex items-center justify-center relative w-full">
          <img
            src={previewImage} // Dynamically update the image source
            alt="Preview"
            className="w-full h-[200px] object-cover rounded-xl"
          />
        </div>

        {/* Text prompt */}
        {fileList.length === 0 && (
          <div className="drop-file-input__label flex flex-col items-center mb-5">
            <p className="text-gray-700 text-lg">Drag & Drop your files here</p>
          </div>
        )}

        {/* Input element covering the entire div */}
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileDrop}
        />
      </div>

      {fileList.length > 0 && (
        <div className="w-full mt-2 space-y-2 flex flex-col mx-auto">
          {fileList.map((item, index) => (
            <button
              key={index}
              className="bg-red-500 hover:bg-blue-600 text-center cursor-pointer w-full text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition duration-200 hover:scale-105"
              onClick={() => fileRemove(item)}
            >
              Cancel
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func.isRequired, // Ensure onFileChange is required
};

export default DropFileInput;
