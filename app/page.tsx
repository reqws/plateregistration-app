"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";

// Plate type for TypeScript safety
type Plate = {
  id: string;
  plateNumber: string;
  ownerName: string;
  createdAt: string;
};

export default function PlateTable() {
  // All plate registrations fetched from backend
  const [registrations, setRegistrations] = useState<Plate[]>([]);

  // Search input
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Admin login modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Login form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Max items displayed per page
  const itemsPerPage = 10;

  const router = useRouter();

  // Fetch registrations when component loads
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Fetch plate data from API route
  async function fetchRegistrations() {
    const res = await fetch("/api/registration");
    const data = await res.json();
    setRegistrations(data);
  }

  // Filter plates based on search input
  const filteredPlates = registrations.filter(
    (plate) =>
      plate.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlates = filteredPlates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Next page handler
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Previous page handler
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Validate login and redirect to admin page
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple hardcoded admin check
    if (username === "admin" && password === "admin123") {
      setIsLoginOpen(false);
      router.push("/admin"); // redirect to admin dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center p-6">

      {/* Main container */}
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Plate Registry</h1>
        <p className="text-gray-600 text-sm mb-6">All registered plates below.</p>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by plate number or owner name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Plates Table */}
        <div className="overflow-x-auto">
          {currentPlates.length === 0 ? (
            // No results message
            <p className="text-gray-500">No matching plates found.</p>
          ) : (
            <table className="min-w-full border border-gray-300 text-left text-sm rounded-md shadow-sm overflow-hidden">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="p-3 border-b border-gray-300">Plate Number</th>
                  <th className="p-3 border-b border-gray-300">Owner Name</th>
                  <th className="p-3 border-b border-gray-300">Created At</th>
                </tr>
              </thead>

              <tbody>
                {currentPlates.map((plate, index) => (
                  <tr
                    key={plate.id}
                    // Alternating row colors + hover effect
                    className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="p-3 border-b border-gray-300">{plate.plateNumber}</td>
                    <td className="p-3 border-b border-gray-300">{plate.ownerName}</td>
                    <td className="p-3 border-b border-gray-300">
                      {new Date(plate.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredPlates.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-6">

            {/* Previous button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium ${currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                }`}
            >
              Previous
            </button>

            {/* Page indicator */}
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            {/* Next button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium ${currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Admin Login Button - opens modal */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition"
          >
            Admin Login
          </button>
        </div>
      </div>

      {/* Admin Login Popup Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          {/* Modal Box */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6 transform transition-all scale-100 animate-fadeIn">

            {/* Header Section */}
            <div className="text-center">
              <FaLock className="text-blue-500 text-4xl mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-blue-700">Admin Login</h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your credentials to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            {/* Cancel Closes Modal */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="text-sm text-gray-400 hover:text-gray-600 mt-2 text-center"
            >
              Cancel
            </button>

            {/* Mini Footer */}
            <div className="text-center text-sm text-gray-400 mt-2">
              &copy; {new Date().getFullYear()} Plate Registry
            </div>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Plate Registry
      </footer>
    </div>
  );
}
