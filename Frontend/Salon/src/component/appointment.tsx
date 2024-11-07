import { useState } from "react";

// Sample service data
const services = [
  {
    category: "Facial",
    options: [
      {
        name: "Basic Facial",
        description: "A simple facial to clean and refresh your skin.",
        price: "$50",
      },
      {
        name: "Luxury Facial",
        description: "A luxurious facial with premium products.",
        price: "$120",
      },
      {
        name: "Anti-Aging Facial",
        description: "Special treatment to combat wrinkles and fine lines.",
        price: "$150",
      },
      {
        name: "Deep Cleansing Facial",
        description: "A deep pore cleansing facial to remove impurities.",
        price: "$80",
      },
    ],
  },
  {
    category: "Massage",
    options: [
      {
        name: "Swedish Massage",
        description: "A relaxing full-body massage with light pressure.",
        price: "$70",
      },
      {
        name: "Hot Stone Massage",
        description: "A therapeutic massage using heated stones.",
        price: "$100",
      },
      {
        name: "Aromatherapy Massage",
        description: "A soothing massage with essential oils.",
        price: "$90",
      },
      {
        name: "Deep Tissue Massage",
        description: "A deep massage to relieve muscle tension.",
        price: "$110",
      },
    ],
  },
  {
    category: "Hair Treatment",
    options: [
      {
        name: "Haircut",
        description: "A fresh, stylish haircut tailored to your preference.",
        price: "$40",
      },
      {
        name: "Shampoo & Condition",
        description: "A shampoo and conditioning treatment.",
        price: "$30",
      },
      {
        name: "Scalp Treatment",
        description: "A treatment to nourish and hydrate your scalp.",
        price: "$50",
      },
      {
        name: "Hair Coloring",
        description: "A coloring service to refresh your hair's look.",
        price: "$80",
      },
    ],
  },
];

function Appointment() {
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: string[];
  }>({});

  // Tab change handler
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Handle service selection for checkboxes
  const handleServiceChange = (category: string, service: string) => {
    setSelectedServices((prev) => {
      const updatedSelection = prev[category] ? [...prev[category]] : [];
      if (updatedSelection.includes(service)) {
        return {
          ...prev,
          [category]: updatedSelection.filter((s) => s !== service),
        };
      } else {
        updatedSelection.push(service);
        return { ...prev, [category]: updatedSelection };
      }
    });
  };

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Tabs */}
      <div className="flex justify-around border-b">
        <button
          className={`px-4 py-2 ${activeTab === "1" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => handleTabChange("1")}
        >
          Select Services
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "2" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => handleTabChange("2")}
        >
          Select Date
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "3" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => handleTabChange("3")}
        >
          Personal Info
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "1" && (
        <div className="mt-4">
          <h2 className="mb-4 text-xl font-bold">Select Your Services</h2>
          {services.map((category, idx) => (
            <div key={idx} className="mb-4">
              <div
                onClick={() => toggleCategory(category.category)}
                className="mb-2 cursor-pointer text-lg font-semibold"
              >
                {category.category}{" "}
                <span>{openCategory === category.category ? "▲" : "▼"}</span>
              </div>
              {openCategory === category.category && (
                <div className="ml-4">
                  {category.options.map((option) => (
                    <div key={option.name} className="flex items-center py-2">
                      <div className="flex-1">
                        <div className="font-bold">{option.name}</div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                      <div className="flex gap-2 text-blue-500">
                        <p>{option.price}</p>
                        <input
                          type="checkbox"
                          checked={selectedServices[
                            category.category
                          ]?.includes(option.name)}
                          onChange={() =>
                            handleServiceChange(category.category, option.name)
                          }
                          className="mr-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "2" && (
        <div className="mt-4">
          <h2>Select a Date</h2>
          {/* Add your calendar component here */}
        </div>
      )}

      {activeTab === "3" && (
        <div className="mt-4">
          <h2>Enter Your Information</h2>
          {/* Add form fields for user info */}
        </div>
      )}
    </div>
  );
}

export default Appointment;
