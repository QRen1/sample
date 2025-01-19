import React from "react";
import PropTypes from "prop-types";
const UploadButton = (props) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 min-w-[250px] mx-auto text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition duration-200 hover:scale-105"
      onClick={props.onClick}
    >
      Upload
    </button>
  );
};

UploadButton.propTypes = {
  onClick: PropTypes.func,
};

export default UploadButton;
