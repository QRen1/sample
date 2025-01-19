import React, { useState, useEffect } from "react";
import model from "../../assets/model.jpg";
import Appointment from "../../component/appointment.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from "react-router-dom";

function ServicesPage({ isLoggedIn }) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openOuterDialog, setOpenOuterDialog] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [servicesData, setServicesData] = useState([]); // Fetched services
  const navigate = useNavigate();

  // Fetch services data from the backend
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

  // Filtered data based on search, price range, and category
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

  // const handleOpenOuterDialog = (item) => {
  //   if (!isLoggedIn) {
  //     navigate("/auth");
  //   } else {
  //     setSelectedAppointment(item); // Ensure the selected item is passed correctly
  //     setOpenOuterDialog(true);
  //   }
  // };
  const handleOpenOuterDialog = (item) => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      setSelectedAppointment({
        title: item.serviceName,
        price: item.servicePrice,
        description: item.serviceDescription,
      });
      setOpenOuterDialog(true);
    }
  };

  const handleCloseOuterDialog = () => {
    setOpenOuterDialog(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="mx-auto p-6 mt-[80px] fourth:mt-[100px] third:mt-[110px] relative overflow-auto">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search services..."
          className="p-2 border border-black rounded-md w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter by Category */}
      <div className="mb-4">
        <select
          className="p-2 border border-black bg-white rounded-md w-[130px]"
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

      {/* Filter by Price */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Price</h2>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label htmlFor="min-price" className="mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="min-price"
              className="p-2 border border-gray-300 rounded-md"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="max-price" className="mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="max-price"
              className="p-2 border border-gray-300 rounded-md"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="grid grid-cols-1 fifthhh:grid-cols-2 fourth:grid-cols-3 gap-2">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center justify-center rounded-md bg-[rgb(252,222,190)] p-2 w-full"
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
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No services found</p>
        )}

        {/* Dialog for Appointment */}
        <Dialog
          open={openOuterDialog}
          onClose={handleCloseOuterDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <DialogContent>
              {openOuterDialog && selectedAppointment && (
                <Appointment
                  selectedItem={selectedAppointment}
                  setOpenOuterDialog={setOpenOuterDialog}
                />
              )}
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOuterDialog} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ServicesPage;
