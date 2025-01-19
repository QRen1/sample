import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import axios from "axios"; // Ensure axios is imported

const CartAppointment = () => {
  const [cart, setCart] = useState([]); // Cart items from localStorage or state
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(""); // Only one time can be selected

  const [bookedTimes, setBookedTimes] = useState([]); // Store booked times
  const userToken = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage
  const getUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const profileData = await response.json();
      return profileData; // Assuming profile data is returned as JSON
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error; // Optionally, throw the error if you need to handle it later
    }
  };
  // Load user data and cart from localStorage on mount
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("userToken:", userToken);

    if (userToken) {
      console.log("User is logged in, fetching profile...");
      getUserProfile() // Ensure this function gets the correct profile
        .then((profile) => {
          console.log("Fetched profile:", profile);
          const userId = profile?.userId;
          if (userId) {
            console.log("User ID:", userId);

            // Load user's cart from localStorage
            const storedCart =
              JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            console.log("Loaded cart from localStorage:", storedCart);

            // Set the cart state with the loaded data
            setCart(storedCart);

            // Load user info (name and email)
            const storedUserInfo =
              JSON.parse(localStorage.getItem(`userProfile_${userId}`)) || {};
            setUserInfo({
              name: storedUserInfo.name || "",
              email: storedUserInfo.email || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    } else {
      console.log("User not logged in or token not available.");
      setCart([]); // Set cart to empty if user is not logged in
      setUserInfo({ name: "", email: "" }); // Clear user info
    }
  }, []); // Run this effect only once on mount

  // Function to decode the JWT token (used for getting user info)
  const decodeToken = (token) => {
    const payload = token.split(".")[1];
    const decoded = atob(payload); // Decode the base64 part
    return JSON.parse(decoded); // Parse and return the decoded JSON string
  };

  // Calculate the total price of all cart items
  const calculateTotalPrice = () => {
    return cart
      .reduce(
        (total, item) => total + parseFloat(item.price.replace("$", "")),
        0
      )
      .toFixed(2); // Format the price to 2 decimal places
  };

  // Define available working hours for each day of the week
  const getAvailableHours = (day) => {
    const hours = [
      { day: 0, start: "closed", end: "closed" }, // Sunday
      { day: 1, start: "9am", end: "5pm" }, // Monday
      { day: 2, start: "9am", end: "5pm" }, // Tuesday
      { day: 3, start: "9am", end: "5pm" }, // Wednesday
      { day: 4, start: "9am", end: "5pm" }, // Thursday
      { day: 5, start: "9am", end: "5pm" }, // Friday
      { day: 6, start: "10am", end: "3pm" }, // Saturday
    ];
    return hours.find((h) => h.day === day);
  };

  // Generate time slots based on working hours for each day
  const handleDateChange = (date) => {
    setAppointmentDate(date);
    const dayOfWeek = date.getDay(); // Get the day index (0 = Sunday, 6 = Saturday)
    const dayName = new Date(date)
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayHours = availableHours.find((hours) => hours.day === dayName);

    if (dayHours && dayHours.hoursStart !== "closed") {
      const slots = generateTimeSlots(dayHours.hoursStart, dayHours.hoursEnd);
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]); // No slots available if the store is closed
    }
  };

  // Generate available time slots (e.g., 9am to 5pm becomes [9am, 10am, 11am, ..., 5pm])
  const generateTimeSlots = (start, end) => {
    const times = [];
    let startTime = convertTo24HrFormat(start);
    let endTime = convertTo24HrFormat(end);

    while (startTime < endTime) {
      const hour = new Date();
      hour.setHours(startTime, 0);
      times.push(
        hour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      startTime += 1; // Increment the hour
    }

    return times;
  };

  // Convert 12-hour time (e.g., "9am") to 24-hour format (e.g., 9)
  const convertTo24HrFormat = (time) => {
    const [hour, modifier] = time.split(/(am|pm)/i);
    let [h, m] = hour.split(":");
    h = parseInt(h);
    if (modifier.toLowerCase() === "pm" && h !== 12) h += 12;
    if (modifier.toLowerCase() === "am" && h === 12) h = 0;
    return h;
  };

  // Handle time slot selection
  const handleTimeClick = (time) => {
    setSelectedTime((prevTime) => (prevTime === time ? "" : time));
  };

  // Handle the form submission for all items
  const handleSubmit = () => {
    // Log the form data before validation
    console.log("Appointment Date:", appointmentDate);
    console.log("User Info:", userInfo);
    console.log("Selected Times:", selectedTimes);

    if (!appointmentDate || !userInfo.name || !userInfo.email) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure all cart items have a selected time
    for (let item of cart) {
      if (!selectedTimes[item.id]) {
        alert(`Please select a time for the appointment of ${item.title}`);
        return;
      }
    }

    // Log the cart items to ensure we have the correct data
    console.log("Cart Items:", cart);

    // Add each cart item booking to localStorage
    cart.forEach((item) => {
      const updatedAppointments = [
        ...bookedTimes,
        {
          date: appointmentDate.toISOString().split("T")[0],
          time: selectedTimes[item.id], // Time for this item
          itemId: item.id,
          status: "unavailable",
        },
      ];

      // Log the updated appointment data before storing it
      console.log("Updated Appointments:", updatedAppointments);

      // Save to localStorage
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      setBookedTimes(updatedAppointments);
    });

    // Log the final state after the bookings have been completed
    console.log("Bookings successfully completed.");
    alert("Appointments booked successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Cart Items</h2>
        <p className="text-xl font-semibold">
          Total Price: ${calculateTotalPrice()}
        </p>
      </div>

      {/* Display cart items */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items mb-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="cart-item mb-4 p-4 bg-gray-100 rounded-md"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <label
          htmlFor="appointment-date"
          className="block text-sm font-medium text-gray-700"
        >
          Appointment Date:
        </label>
        <DatePicker
          selected={appointmentDate}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
          placeholderText="Select a date"
          minDate={new Date()} // Prevent selecting past dates
        />
      </div>

      {/* Time Picker for Appointment */}
      {availableTimeSlots.length > 0 && (
        <div className="mb-4 items-center flex flex-col">
          <label
            htmlFor="appointment-time"
            className="block text-sm font-medium text-gray-700"
          >
            Available Times:
          </label>
          <div className="grid grid-cols-2 gap-2 place-items-center w-full">
            {availableTimeSlots.map((time, index) => {
              const isBooked = bookedTimes.some(
                (booking) =>
                  booking.date ===
                    appointmentDate.toISOString().split("T")[0] &&
                  booking.time === time
              );
              const isSelected = selectedTime === time;

              return (
                <button
                  key={index}
                  onClick={() => handleTimeClick(time)}
                  disabled={isBooked} // Disable only the booked time
                  className={`py-2 px-4 w-full text-sm font-medium text-white rounded-md focus:outline-none ${
                    isBooked
                      ? "bg-red-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-400"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default CartAppointment;
