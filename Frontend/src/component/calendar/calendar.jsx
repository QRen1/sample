import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import styles for the calendar
import PropTypes from "prop-types"; // Import prop-types package
import "../../styles/calendar.css"; // Assuming custom styling is here

// Functional component
function CalendarComponent({ onDateSelect }) {
  const [date, setDate] = useState(new Date()); // Default date set to today
  const [formattedDate, setFormattedDate] = useState(""); // State to hold formatted date
  const [availableHours, setAvailableHours] = useState([]); // State to hold available hours

  const handleDateChange = (newDate) => {
    setDate(newDate);

    // Format the selected date (e.g., "Nov 15, 2024" or "15th November 2024")
    const formatted = newDate.toLocaleDateString("en-US", {
      weekday: "long", // "Monday"
      year: "numeric", // "2024"
      month: "short", // "Nov"
      day: "numeric", // "15"
    });

    setFormattedDate(formatted); // Save the formatted date in the state
    onDateSelect(newDate); // Pass selected date back to the parent component

    // Generate available hours (from 9 AM to 5 PM, each 1 hour increment)
    const hours = [];
    for (let hour = 9; hour < 17; hour++) {
      const formattedHour = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${
        hour >= 12 ? "PM" : "AM"
      }`;
      hours.push(formattedHour);
    }
    setAvailableHours(hours); // Set the available hours
  };

  return (
    <div className="calendar-container p-4">
      {/* Header for the calendar */}
      <h2 className="text-xl font-semibold text-center py-3 border-b-2 mb-4">
        Select a Date
      </h2>

      {/* React Calendar */}
      <Calendar
        className="calendar w-full mx-auto" // Ensure full width and center alignment
        onChange={handleDateChange}
        value={date}
        minDate={new Date()} // Disable past dates
        next2Label={null} // Hides the double arrow (you can customize this further if needed)
        prev2Label={null} // Hides the double arrow
        locale="en-US" // Set locale for date format
      />

      {/* Display selected date */}
      <div className="mt-4 text-center">
        {formattedDate && (
          <p className="text-lg font-medium">Selected Date: {formattedDate}</p>
        )}
      </div>

      {/* Display Available Hours (9 AM to 5 PM) */}
    </div>
  );
}

// Define prop type for `onDateSelect`
CalendarComponent.propTypes = {
  onDateSelect: PropTypes.func.isRequired, // Ensure `onDateSelect` is passed as a function
};

export default CalendarComponent;
