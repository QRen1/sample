import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile({ setIsLoggedIn }) {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]); // State to store user appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // State to manage active tab (all or done)
  const navigate = useNavigate(); // Use navigate hook for redirection

  // Fetch profile and appointments on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Token is missing, please log in.");
      setLoading(false);
      return;
    }

    // Fetch the profile first
    axios
      .get("https://madonna-backend.onrender.com/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && response.data.userId) {
          setProfile(response.data);

          // Fetch the user's appointments based on the userId
          return axios.get(
            `https://madonna-backend.onrender.com/api/appointments/get/${response.data.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          throw new Error("User ID is missing in profile data");
        }
      })
      .then((response) => {
        if (Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else if (response.data.message === "No appointments found") {
          setAppointments([]); // No appointments found, set to empty array
        } else {
          setAppointments([]); // Handle any unexpected response
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile or appointments:", err);
        setError("Failed to fetch profile or appointments: " + err.message);
        setLoading(false);
      });
  }, []);

  // Log out function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false); // Set isLoggedIn to false to update the parent component state
    navigate("/"); // Redirect to auth page after logging out
  };

  // Handle appointment cancellation
  const handleCancel = (appointmentId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Token is missing, please log in.");
      return;
    }

    // Make a DELETE request to remove the appointment
    axios
      .delete(
        `https://madonna-backend.onrender.com/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // On success, remove the cancelled appointment from the state
        setAppointments(
          appointments.filter((app) => app._id !== appointmentId)
        );
      })
      .catch((err) => {
        console.error("Error cancelling appointment:", err);
        setError("Failed to cancel appointment: " + err.message);
      });
  };

  // Filter appointments based on the selected tab
  const filteredAppointments =
    activeTab === "done"
      ? appointments.filter((appointment) => appointment.status === "done")
      : appointments;

  useEffect(() => {
    console.log("Updated Appointments:", appointments); // Log appointments whenever it changes
  }, [appointments]);

  // Loading and error handling
  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex w-full pt-[70px] fourth:pt-[120px] justify-center min-h-screen bg-[#fcdebe]">
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex mt-1 justify-end px-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "all"
                ? "bg-gray-500 text-white"
                : "bg-white text-gray-500"
            } rounded-lg border`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "done"
                ? "bg-gray-500 text-white"
                : "bg-white text-gray-500"
            } rounded-lg border`}
          >
            Done Appointments
          </button>
        </div>

        {/* Display Appointments */}
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            No appointments found
          </p>
        ) : (
          <ul className="flex flex-col p-2 fifthh:grid fifthh:grid-cols-2 fourthh:grid-cols-3 gap-2 w-full">
            {filteredAppointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-6 bg-white rounded-lg border-red-500 border shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Service: {appointment.service}
                  </p>
                  <p className="text-lg font-bold text-teal-600">
                    ¥{appointment.price} {/* Displaying price */}
                  </p>
                </div>
                <section className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-md text-gray-600">
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-md text-gray-600">
                      Time: {appointment.time}
                    </p>
                    <button
                      onClick={() => handleCancel(appointment._id)} // Pass the appointment ID to cancel
                      className="max-h-[50px] py-2 mt-2 bg-red-500 rounded-lg border-white text-white border  transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-md text-gray-600">
                    Status: {appointment.appointment} {/* Status added */}
                  </p>
                </section>
              </li>
            ))}
            <button
              onClick={handleLogout}
              className="p-6 bg-red-500 rounded-lg border-white text-white border shadow-lg hover:shadow-xl transition duration-300"
            >
              LOG OUT
            </button>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
