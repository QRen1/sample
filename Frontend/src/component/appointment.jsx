import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = ({ selectedItem, setOpenOuterDialog }) => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "", _id: "" });
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availability, setAvailability] = useState({
    monday: { status: "available", start: "", end: "" },
    tuesday: { status: "available", start: "", end: "" },
    wednesday: { status: "available", start: "", end: "" },
    thursday: { status: "available", start: "", end: "" },
    friday: { status: "available", start: "", end: "" },
    saturday: { status: "available", start: "", end: "" },
    sunday: { status: "available", start: "", end: "" },
  });

  const userToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (userToken) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://madonna-backend.onrender.com/api/appointments/get",
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );

          const appointments = Array.isArray(response.data)
            ? response.data
            : response.data.appointments;

          // Log the fetched appointments to the console
          console.log("Fetched Appointments:", appointments);

          const booked = appointments.map((appointment) => ({
            date: appointment.date,
            time: appointment.time,
            status: appointment.status, // Add status
          }));
          setBookedTimes(booked);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          toast.error("Failed to fetch appointments. Please try again.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      };

      fetchData();
    }
  }, [userToken]);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://madonna-backend.onrender.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setUserInfo({
        name: response.data.fullName || "",
        email: response.data.email || "",
        _id: response.data.userId || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const loadBookedAppointments = async () => {
    if (userToken) {
      try {
        const response = await axios.get(
          "https://madonna-backend.onrender.com/api/appointments/get",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const appointments = Array.isArray(response.data)
          ? response.data
          : response.data.appointments; // Adjust based on API structure
        const booked = appointments.map((appointment) => ({
          date: appointment.date,
          time: appointment.time,
          status: appointment.status, // Add status to booked appointments
        }));
        setBookedTimes(booked);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const loadAvailability = async () => {
    try {
      const response = await axios.get(
        "https://madonna-backend.onrender.com/api/availabilities/availability/get"
      );
      const { weeklyAvailability } = response.data?.availability || {};
      if (weeklyAvailability) {
        setAvailability((prev) => ({ ...prev, ...weeklyAvailability }));
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (userToken) {
      loadUserProfile();
      loadBookedAppointments();
      loadAvailability();
    }
  }, [userToken]);

  const generateTimeSlots = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      slots.push(`${hour12}:00 ${ampm}`);
    }
    return slots;
  };

  const getAvailableTimeSlots = (date) => {
    if (!date) return [];

    const dayName = date
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayAvailability = availability[dayName];

    if (!dayAvailability || dayAvailability.status === "unavailable") {
      return [];
    }

    const { start, end } = dayAvailability;
    return start && end ? generateTimeSlots(start, end) : [];
  };

  const handleDateChange = (date) => {
    setAppointmentDate(date);
    const slots = getAvailableTimeSlots(date);
    setAvailableTimeSlots(slots);
  };

  const handleTimeClick = (time) => {
    setSelectedTime((prev) => (prev === time ? "" : time));
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !appointmentDate ||
      !selectedTime ||
      !userInfo.name ||
      !userInfo.email ||
      !userInfo._id
    ) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const localDate = new Date(appointmentDate);
    const [hour, ampm] = selectedTime.split(" ");
    let hour24 = parseInt(hour, 10);
    if (ampm === "PM" && hour24 !== 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;

    localDate.setHours(hour24, 0, 0, 0);

    const appointmentData = {
      user: userInfo._id,
      service: selectedItem?.title,
      date: localDate.toISOString().split("T")[0],
      time: selectedTime,
      price: selectedItem?.price,
      status: "unavailable",
    };

    try {
      const response = await axios.post(
        "https://madonna-backend.onrender.com/api/appointments/post",
        appointmentData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setBookedTimes((prev) => [
        ...prev,
        {
          date: appointmentData.date,
          time: selectedTime,
          service: selectedItem?.title,
        },
      ]);
      toast.success(
        `Appointment successfully booked for $${selectedItem?.price}!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      setOpenOuterDialog(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  const isTimeSlotDisabled = (time) => {
    if (!appointmentDate) return false;

    const selectedDate = new Date(appointmentDate); // Convert to local time
    const selectedDateString = selectedDate.toLocaleDateString("en-CA"); // Format to YYYY-MM-DD

    const isBooked = bookedTimes.some(
      (appointment) =>
        new Date(appointment.date).toLocaleDateString("en-CA") ===
          selectedDateString && // Ensure both dates are compared in local format
        appointment.time === time && // Match the time
        appointment.status === "unavailable"
    );

    return isBooked; // Return true to disable the button
  };

  const isDateDisabled = (date) => {
    // Format the selected date into the format YYYY-MM-DD
    const selectedDate = date.toISOString().split("T")[0]; // Get the date part (YYYY-MM-DD)

    // Check if any booked appointment matches the selected date and service
    const isBooked = bookedTimes.some(
      (appointment) =>
        appointment.date === selectedDate && // Match the date
        appointment.service === selectedItem?.title && // Match the service
        appointment.status === "unavailable" // Ensure it's unavailable
    );

    return isBooked; // Disable the date if it's already booked
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg">
      <ToastContainer />
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h2 className="text-2xl font-bold mb-4">
          Book Appointment for: {selectedItem?.title}
        </h2>
        <p className="text-lg mb-2">Price: {selectedItem?.price}</p>
        <p className="text-sm text-gray-500 mb-4">
          {selectedItem?.description}
        </p>
      </div>

      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={userInfo.name}
            onChange={handleUserInfoChange}
            placeholder="Enter your full name"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            placeholder="Enter your email"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="appointment-date"
            className="block text-sm font-medium"
          >
            Appointment Date:
          </label>
          <DatePicker
            selected={appointmentDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            placeholderText="Select a date"
            minDate={new Date()} // Prevent selection of past dates
            filterDate={(date) => !isDateDisabled(date)} // Disable dates with booked appointments
          />
        </div>
      </form>

      {/* Render available times if date is selected */}
      {availableTimeSlots.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Available Times:</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTimeSlots.map((time, index) => {
              const isDisabled = isTimeSlotDisabled(time); // Check if the time is already booked
              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleTimeClick(time)}
                  disabled={isDisabled}
                  className={`py-2 px-4 rounded-md ${
                    isDisabled
                      ? "bg-red-400 text-white cursor-not-allowed"
                      : selectedTime === time
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isTimeSlotDisabled(selectedTime) || !selectedTime}
        className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md ${
          isTimeSlotDisabled(selectedTime) || !selectedTime
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600"
        }`}
      >
        Book Appointment
      </button>
    </div>
  );
};

export default Appointment;
