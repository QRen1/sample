import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
  const chartRef = React.createRef();
  const [servicesData, setServicesData] = useState([]); // Fetched services
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Helper function to generate data for weekly, monthly, and yearly
  const getTimeRangeData = () => {
    const counts = {
      weekly: [],
      monthly: new Array(12).fill(0),
      yearly: [],
    };

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // Month index (0 = January)
      const dayOfYear = Math.floor(
        (date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24)
      );
      const weekOfYear = Math.ceil(dayOfYear / 7);

      // Weekly count: Track daily appointments for each week
      const dayOfWeek = date.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ...)
      if (!counts.weekly[weekOfYear]) {
        counts.weekly[weekOfYear] = new Array(7).fill(0); // Initialize an array for each week (7 days)
      }
      counts.weekly[weekOfYear][dayOfWeek]++; // Increment the count for the specific day of the week

      // Monthly count
      counts.monthly[month]++;

      // Yearly count
      if (!counts.yearly[year]) {
        counts.yearly[year] = 0;
      }
      counts.yearly[year]++;
    });

    return counts;
  };

  const timeRangeData = getTimeRangeData();

  // Prepare chart data based on selected time range
  const chartData = {
    weekly: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Appointments Per Week",
          data: timeRangeData.weekly.flatMap((week) => week),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    },
    monthly: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Appointments Per Month",
          data: timeRangeData.monthly,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    },
    yearly: {
      labels: Object.keys(timeRangeData.yearly),
      datasets: [
        {
          label: "Appointments Per Year",
          data: Object.values(timeRangeData.yearly),
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderWidth: 2,
        },
      ],
    },
  };
  const filteredData = servicesData.filter((item) => {
    const matchesSearch =
      item.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      item.servicePrice >= minPrice && item.servicePrice <= maxPrice;
    const matchesCategory =
      selectedCategory === "All" || item.serviceCategory === selectedCategory;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Categories for filtering
  const categories = [
    "All",
    ...[...new Set(servicesData.map((item) => item.serviceCategory))],
  ];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(Number(e.target.value));
  const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  // Resize the chart when the window size changes
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.resize(); // Resize method triggers the resize event
        chartRef.current.chartInstance.update("none"); // Update chart after resize (force reflow)
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "https://madonna-backend.onrender.com/api/services/getService"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        console.log("Fetched services data:", data);
        setServicesData(data.services); // Assuming the response includes a `services` array
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const userToken = localStorage.getItem("AdminToken");
        const response = await axios.get(
          "https://madonna-backend.onrender.com/api/appointments/get",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        const appointmentsData = response.data?.appointments || [];
        // Filter for only 'done' appointments
        const doneAppointments = appointmentsData.filter(
          (appointment) => appointment.appointment === "waiting"
        );

        // Sort appointments by date in descending order (newest first)
        doneAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAppointments(doneAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1">
        {loading && <p className="text-center">Loading appointments...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full flex flex-col">
            <div className="flex gap-2 justify-end text-[12px] fifthhh:text-[14px] third:text-[20px] ">
              <button
                className={`px-4 py-2   ${
                  selectedTimeRange === "weekly"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTimeRange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-4 py-2   ${
                  selectedTimeRange === "monthly"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTimeRange("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2  ${
                  selectedTimeRange === "yearly"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTimeRange("yearly")}
              >
                Yearly
              </button>
            </div>
            <div className="min-w-full h-[300px] fifthhh:h-[400px] third:h-[500px] second:h-[600px]">
              <Line
                ref={chartRef}
                data={chartData[selectedTimeRange]}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Disable aspect ratio to make the chart resize freely
                }}
              />
            </div>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <p className="text-center text-gray-600">
            No appointments found with status "done".
          </p>
        )}
      </div>
      <div className="flex flex-col fourth:grid fourth:grid-cols-[6fr_4fr]">
        <div className="flex flex-col">
          <div className="flex flex-col p-3">
            <div className="mb-4 max-w-full">
              <input
                type="text"
                placeholder="Search services..."
                className="p-2 border border-black rounded-md w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="block gap-2 fifthh:flex fifthh:justify-between">
              {/* Filter by Price */}
              <div className="mb-2">
                <div className="flex gap-1">
                  <div className=" flex flex-col ">
                    <label htmlFor="min-price" className="mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      className="p-2 border border-black  rounded-md w-[100px]"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                    />
                  </div>
                  <div className=" flex flex-col">
                    <label htmlFor="max-price" className="mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      className="p-2 border border-black rounded-md w-[100px]"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                    />
                  </div>
                </div>
              </div>
              {/* Filter by Category */}
              <div className="mb-4 flex flex-col">
                <label htmlFor="min-price" className="mb-1">
                  Category
                </label>
                <select
                  className="p-2 border border-black bg-white rounded-md w-[100px]"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-scroll scrollbar-hide max-h-[700px] p-3 grid grid-cols-1 gap-3 fifthh:grid-cols-2 ">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col items-center justify-center rounded-md shadow-lg border border-gray-400 p-2 w-full"
                >
                  <img
                    src={item.serviceFile?.url}
                    className="mt-2 w-full border border-black object-cover"
                    alt={item.serviceName}
                  />
                  <div className="h-[135px] w-full p-3">
                    <div className="flex flex-col mb-2 h-[70px] overflow-hidden">
                      <section className="flex justify-between">
                        <h1>{item.serviceName}</h1>
                        <h1>¥{item.servicePrice}</h1>
                      </section>
                      <section className="w-full">
                        <p>{item.serviceDescription}</p>
                      </section>
                    </div>
                    <div className="flex justify-between gap-2 mx-2">
                      <button
                        className="border border-[#fcdebe] py-2 w-full bg-red-500 text-white"
                        onClick={() => handleOpenOuterDialog(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No services found</p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-center text-[25px]">Appointments</h1>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && appointments.length === 0 && (
            <p className="text-center">No appointments available.</p>
          )}
          {!loading && !error && appointments.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              {appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="border p-4 mb-2 w-full max-w-md bg-white shadow-md rounded"
                >
                  <h2 className="text-lg font-semibold">{appointment.title}</h2>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(appointment.date).toLocaleDateString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {appointment.time || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Notes: {appointment.appointment || "No additional notes"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
