import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StaffProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminConfirmationOpen, setIsAdminConfirmationOpen] = useState(false); // New state for the confirmation modal
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("AdminToken");

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/staff/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
      }
    };

    // Fetch all staff data
    const fetchAllStaff = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/staff/staff",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch staff");
        }

        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching all staff:", error);
        setError("Failed to fetch staff");
      }
    };

    fetchProfile();
    fetchAllStaff();
  }, []);

  // Update a staff member's status
  const updateStaffStatus = async (id, newStatus) => {
    const token = localStorage.getItem("AdminToken");

    if (!id) {
      console.error("Invalid staff member ID");
      setError("Invalid staff member ID");
      return;
    }

    // Ensure only one admin is allowed
    if (newStatus === "admin") {
      // Check if there’s already an admin
      const existingAdmin = staff.find(
        (staffMember) => staffMember.status === "admin"
      );
      if (existingAdmin) {
        // Open the confirmation modal if there's an existing admin
        setSelectedStaffMember(existingAdmin); // Set the current admin
        setNewStatus("admin"); // We're trying to assign "admin"
        setIsAdminConfirmationOpen(true); // Open the confirmation modal
        return; // Do nothing until the user confirms
      }
    }

    // Now update the new staff member's status to admin
    try {
      const response = await fetch(
        `https://madonna-backend.onrender.com/api/staff/staff/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update staff status");
      }

      const updatedStaff = await response.json();

      // Update the staff list with the new status
      setStaff((prevStaff) =>
        prevStaff.map((staffMember) =>
          staffMember._id === id
            ? { ...staffMember, status: updatedStaff.status }
            : staffMember
        )
      );
    } catch (error) {
      console.error("Error updating staff status:", error);
      setError("Failed to update staff status");
    }

    // Close the modal after confirming the update
    setIsModalOpen(false);
  };

  // Handle the modal open
  const handleStatusChange = (staffMember, status) => {
    if (staffMember && staffMember._id) {
      setSelectedStaffMember(staffMember);
      setNewStatus(status);
      setIsModalOpen(true);
    } else {
      console.error("Staff member is invalid: ", staffMember);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Confirm replacing the existing admin
  const confirmReplaceAdmin = async () => {
    if (selectedStaffMember && selectedStaffMember._id) {
      // Replace the existing admin's status to "staff"
      await updateStaffStatus(selectedStaffMember._id, "staff");
      // Then proceed to change the new staff member's status to "admin"
      await updateStaffStatus(selectedStaffMember._id, "admin");
    }

    // Close the confirmation modal
    setIsAdminConfirmationOpen(false);
  };

  // Delete a staff member
  const deleteStaff = async (id) => {
    const token = localStorage.getItem("AdminToken");

    try {
      const response = await fetch(
        `https://madonna-backend.onrender.com/api/staff/staff/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete staff");
      }

      // Update the staff list after deletion
      setStaff((prevStaff) =>
        prevStaff.filter((staffMember) => staffMember._id !== id)
      );
    } catch (error) {
      console.error("Error deleting staff:", error);
      setError("Failed to delete staff");
    }
  };

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex-col flex gap-4 fourthh:grid fourthh:grid-cols-2">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
          {profile ? (
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-2xl font-medium text-gray-700">
                    {profile.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                    profile.status === "admin"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {profile.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading profile...</p>
          )}
        </div>

        {/* Staff Section */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            All Staff
          </h2>
          {staff.length > 0 ? (
            <ul className="space-y-4">
              {staff.map((staffMember) => (
                <li
                  key={staffMember._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-xl font-medium text-gray-700">
                        {staffMember.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {staffMember.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Displaying Status for Non-Admins Only */}
                    {profile?.status !== "admin" && (
                      <span
                        className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                          staffMember.status === "admin"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {staffMember.status}
                      </span>
                    )}

                    {/* Status Dropdown for Admin */}
                    {profile?.status === "admin" && (
                      <select
                        value={staffMember.status}
                        onChange={(e) =>
                          handleStatusChange(staffMember, e.target.value)
                        }
                        className="text-gray-800 px-4 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      >
                        <option value="admin" className="focus:bg-none">
                          Admin
                        </option>
                        <option value="staff" className="focus:bg-none">
                          Staff
                        </option>
                        <option value="none" className="focus:bg-none">
                          None
                        </option>
                      </select>
                    )}

                    {/* Delete Button (Only visible to admins) */}
                    {profile?.status === "admin" && (
                      <button
                        onClick={() => deleteStaff(staffMember._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Loading staff...</p>
          )}
        </div>
      </div>

      {/* Admin Confirmation Modal */}
      {isAdminConfirmationOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg min-h-[150px] z-100 flex flex-col   justify-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Replacing Admin
            </h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to replace the current admin with{" "}
              {selectedStaffMember?.fullName}?
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsAdminConfirmationOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplaceAdmin}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Status Change
            </h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to change {selectedStaffMember?.fullName}'s
              status to {newStatus === "admin" ? "Admin" : newStatus}?
            </p>

            <div className="mt-4 flex gap-2 ">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedStaffMember && selectedStaffMember._id) {
                    updateStaffStatus(selectedStaffMember._id, newStatus);
                    closeModal(); // Close the modal after confirming the update
                  } else {
                    console.error("Invalid staff member");
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffProfileComponent;
