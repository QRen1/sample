import React, { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("Waiting");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const userToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://madonna-backend.onrender.com/api/appointments/get",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        const appointmentsData = response.data?.appointments || [];
        setAppointments(appointmentsData);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle delete appointment
  const handleDelete = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `https://madonna-backend.onrender.com/api/appointments/${appointmentId}`
      );
      if (response.status === 200) {
        // Filter out the deleted appointment from the state
        setAppointments(
          appointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      setError("Failed to delete appointment.");
    }
  };

  // Update appointment status
  const handleEditStatus = async (appointmentId) => {
    if (!newStatus) {
      setError("Please select a new status.");
      return;
    }

    try {
      const response = await axios.put(
        `https://madonna-backend.onrender.com/api/appointments/${appointmentId}`,
        { appointment: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedAppointment = response.data;
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, appointment: updatedAppointment.appointment }
            : appointment
        )
      );

      setEditingAppointment(null);
      setNewStatus("");
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update appointment status.");
    }
  };

  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter(
    (appointment) =>
      typeof appointment.appointment === "string" &&
      appointment.appointment.toLowerCase() === activeTab.toLowerCase()
  );

  const renderAppointments = () => {
    if (loading) return <p className="text-center">Loading appointments...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (filteredAppointments.length === 0)
      return <div className="text-center">No appointments found.</div>;

    return filteredAppointments.map((appointment) => (
      <div
        key={appointment._id}
        className="bg-white shadow-md rounded-lg mb-4 border flex flex-col gap-2 p-6"
      >
        <div className="flex justify-between ">
          <h3 className="text-lg font-bold">{appointment.service}</h3>
          <h3 className="text-lg font-bold">¥{appointment.price}</h3>
        </div>
        <div className="flex justify-between ">
          <section>
            <strong>Date:</strong>{" "}
            {new Date(appointment.date).toLocaleDateString()}{" "}
          </section>
          <section>
            <strong>Time:</strong> {appointment.time}
          </section>
        </div>
        <h3>
          <strong>Status:</strong> {appointment.appointment}
        </h3>
        <h3>
          <strong>User:</strong> {appointment.user?.fullName}
          {appointment.user?.email || "N/A"}
        </h3>

        <div className="mt-4">
          <button
            onClick={() => setEditingAppointment(appointment)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
          >
            Edit Status
          </button>
          <button
            onClick={() => handleDelete(appointment._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        </div>

        {editingAppointment?._id === appointment._id && (
          <div className="mt-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Select a new status</option>
              <option value="waiting">Waiting</option>
              <option value="currently in">Currently In</option>
              <option value="done">Done</option>
            </select>
            <button
              onClick={() => handleEditStatus(appointment._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditingAppointment(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg ml-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="flex justify-around mb-6 w-full gap-2">
        {["Waiting", "Currently In", "Done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold  w-full text-white ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>{renderAppointments()}</div>
    </div>
  );
}

export default Appointments;
