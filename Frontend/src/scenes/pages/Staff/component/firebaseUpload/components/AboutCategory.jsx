import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState({
    monday: { status: "available", start: "", end: "" },
    tuesday: { status: "available", start: "", end: "" },
    wednesday: { status: "available", start: "", end: "" },
    thursday: { status: "available", start: "", end: "" },
    friday: { status: "available", start: "", end: "" },
    saturday: { status: "available", start: "", end: "" },
    sunday: { status: "available", start: "", end: "" },
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateTimeAvailability, setDateTimeAvailability] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [id, setId] = useState(null);

  // Function to load availability from the backend
  const loadAvailability = async () => {
    try {
      const response = await axios.get(
        "https://madonna-backend.onrender.com/api/availabilities/availability/get"
      );
      const data = response.data;
      if (data?.availability) {
        const { weeklyAvailability, specificDateAvailability, id } =
          data.availability;

        // Update state with fetched data
        setAvailability((prevState) => {
          const updatedAvailability = {
            ...prevState,
            ...weeklyAvailability,
          };

          // Log start and end times for debugging
          Object.keys(updatedAvailability).forEach((day) => {
            const { start, end } = updatedAvailability[day];
            console.log(`${day} - Start: ${start}, End: ${end}`);
          });

          return updatedAvailability;
        });

        setDateTimeAvailability(specificDateAvailability?.slots || {});
        setId(id);
      }
    } catch (err) {
      console.error("Error fetching availability", err);
      toast.error("Failed to load availability.");
    }
  };
  useEffect(() => {
    loadAvailability();
  }, []);

  const generateTimeSlots = (startTime, endTime) => {
    if (typeof startTime !== "string" || typeof endTime !== "string") {
      console.warn("Invalid start or end time:", { startTime, endTime });
      return [];
    }

    // Convert time strings to hours
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    // Generate time slots
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour}:00 - ${hour + 1}:00`;
      slots.push(timeSlot);
    }

    return slots;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    // Get the day of the week for the selected date
    const dayOfWeek = selectedDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    // Get the start and end times for the selected day
    const startTime = availability[dayOfWeek]?.start || null;
    const endTime = availability[dayOfWeek]?.end || null;

    // Handle unavailable days or missing times
    if (
      availability[dayOfWeek]?.status === "unavailable" ||
      !startTime ||
      !endTime
    ) {
      return [];
    }

    return generateTimeSlots(startTime, endTime);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // const getAvailableTimeSlots = () => {
  //   if (!selectedDate) return [];
  //   const startHour = 9;
  //   const endHour = 17;
  //   return generateTimeSlots(startHour, endHour);
  // };

  const handleTimeSlotChange = (slot) => {
    setCurrentSlot(slot);
    setIsDialogOpen(true);
  };

  const toggleSlotAvailability = (status) => {
    const dateStr = selectedDate.toLocaleDateString();
    setDateTimeAvailability((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [currentSlot]: status,
      },
    }));
    setIsDialogOpen(false);
    toast.success(`Slot marked as ${status}`);
  };

  const handleGeneralAvailabilityChange = (day, type, event) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [type]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      weeklyAvailability: availability,
      specificDateAvailability: {
        date: selectedDate ? selectedDate.toLocaleDateString() : null,
        slots: dateTimeAvailability,
      },
    };
    try {
      const response = await axios.post(
        "https://madonna-backend.onrender.com/api/availabilities/availability",
        payload
      );
      toast.success("Availability saved!");
    } catch (err) {
      console.error("Error saving availability", err);
      toast.error("Failed to save availability.");
    }
  };

  const handleEdit = async () => {
    setIsEditable(true);

    const payload = {
      weeklyAvailability: availability,
      specificDateAvailability: {
        date: selectedDate ? selectedDate.toLocaleDateString() : null,
        slots: dateTimeAvailability,
      },
    };

    if (!id) {
      console.error("ID not found for editing");
      return;
    }

    try {
      const response = await axios.put(
        `https://madonna-backend.onrender.com/api/availabilities/availability/${id}`,
        payload
      );
      toast.success("Edits saved!");
    } catch (err) {
      console.error("Error updating availability", err);
      toast.error("Failed to update availability.");
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleExitEditClick = () => {
    setIsEditable(false);
  };

  return (
    <div className="bg-white shadow-lg p-2 border border-black h-[850px] rounded-lg overflow-x-scroll scrollbar-hide">
      <div className="bg-white p-6 rounded-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Set Your Availability
        </h2>

        {/* Specific Date Availability Form */}
        <div className="flex flex-col gap-2 mb-6">
          <header className="text-center text-[25px]">
            Schedule for Specific Date
          </header>
          <div className="mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="p-2 rounded border w-full"
              placeholderText="Select a Date"
              minDate={new Date()}
            />
          </div>

          {selectedDate && (
            <div>
              <div className="text-center mb-4 font-medium">
                Available Time Slots for {selectedDate.toLocaleDateString()}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {getAvailableTimeSlots().map((slot, index) => {
                  // Get the day of the week for the selected date
                  const dayOfWeek = selectedDate
                    .toLocaleString("en-US", { weekday: "long" })
                    .toLowerCase();

                  // Check if the selected day is unavailable
                  const isDayUnavailable =
                    availability[dayOfWeek]?.status === "unavailable";

                  // If the day is unavailable, disable the slots for that day
                  const currentStatus = isDayUnavailable
                    ? "unavailable"
                    : dateTimeAvailability[selectedDate.toLocaleDateString()]?.[
                        slot
                      ] || "available";

                  return (
                    <div
                      key={index}
                      className={`py-2 px-4 rounded text-center text-white cursor-pointer ${
                        currentStatus === "available"
                          ? "bg-blue-500"
                          : currentStatus === "unavailable"
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-yellow-500"
                      }`}
                      onClick={() =>
                        currentStatus === "available" &&
                        handleTimeSlotChange(slot)
                      }
                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <section className="w-full border border-gray-400 my-10"></section>

        {/* General Weekly Availability Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.keys(availability).map((day) => (
            <div key={day} className="flex flex-col">
              <label htmlFor={day} className="w-20 text-[20px] capitalize">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <div className="flex flex-col">
                <label
                  htmlFor={`${day}-status`}
                  className="text-sm text-gray-700 mb-2"
                >
                  Set availability
                </label>
                <select
                  id={`${day}-status`}
                  name={day}
                  value={availability[day].status}
                  onChange={(e) =>
                    handleGeneralAvailabilityChange(day, "status", e)
                  }
                  className={`p-2 mb-2 rounded border ${
                    isEditable
                      ? "bg-white text-black cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>

                {availability[day].status === "available" && (
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor={`${day}-start`}
                        className="text-sm text-gray-700 mb-1"
                      >
                        Start Time (AM)
                      </label>
                      <input
                        type="time"
                        id={`${day}-start`}
                        value={availability[day].start || ""}
                        onChange={(e) =>
                          handleGeneralAvailabilityChange(day, "start", e)
                        }
                        className={`p-2 rounded border ${
                          isEditable
                            ? "bg-white text-black cursor-pointer"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isEditable}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor={`${day}-end`}
                        className="text-sm text-gray-700 mb-1"
                      >
                        End Time (PM)
                      </label>
                      <input
                        type="time"
                        id={`${day}-end`}
                        value={availability[day].end || ""}
                        onChange={(e) =>
                          handleGeneralAvailabilityChange(day, "end", e)
                        }
                        className={`p-2 rounded border ${
                          isEditable
                            ? "bg-white text-black cursor-pointer"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-6 col-span-2 gap-2">
            {!isEditable ? (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-lg w-full hover:bg-blue-700 transition"
                disabled={!isEditable}
              >
                Submit
              </button>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleEdit}
                  className="bg-green-500 w-full text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                >
                  Save Edit
                </button>
                <button
                  onClick={handleExitEditClick}
                  className="bg-red-500 w-full text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
                >
                  Exit Edit
                </button>
              </div>
            )}
            {!isEditable && (
              <button
                onClick={handleEditClick}
                className="bg-green-500 text-white py-2 px-6 rounded-lg w-full tracking-[1px] hover:bg-green-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AvailabilityForm;
