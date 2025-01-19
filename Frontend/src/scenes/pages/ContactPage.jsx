import React, { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (without sending data yet)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Just log form data for now (you can replace this with your send logic later)
    setStatusMessage("Form submitted! (Data logged to console)"); // For now, just show a status message
  };

  return (
    <div className="flex flex-col w-full bg-[#fcdebe] mt-[50px] fourth:mt-[120px] items-center justify-center p-6">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="text-center text-sm mt-3 text-gray-600">
              <p>{statusMessage}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className="w-full flex flex-col gap-2 p-3 mt-[50px] bg-white rounded-lg shadow-lg max-w-[1024px]">
        <h1 className="text-[20px] third:text-[30px]">Where to find us: </h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.035246268041!2d120.9212963757776!3d14.935129568797551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ab52d22d828d%3A0x24adc9cf1ff0b3fb!2sPlaridel%20Bypass%20Rd%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1732428712154!5m2!1sen!2sph"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map Location"
          className="w-full h-[400px]"
        >
          awd
        </iframe>
      </div>
    </div>
  );
}

export default ContactPage;
