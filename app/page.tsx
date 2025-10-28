'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Plate = {
  id: string;
  plateNumber: string;
  ownerName: string;
  createdAt: string;
};

export default function PlateTable() {
  const [registrations, setRegistrations] = useState<Plate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    const res = await fetch('/api/registration');
    const data = await res.json();
    setRegistrations(data);
  }

  // Filtered results based on search
  const filteredPlates = registrations.filter(
    (plate) =>
      plate.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlates = filteredPlates.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center p-6">
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
              setCurrentPage(1); // reset to first page when searching
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {currentPlates.length === 0 ? (
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
                    className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium ${currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transition'
                }`}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transition'
                }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Admin Login button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition"
          >
            Admin Login
          </button>
        </div>
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Plate Registry
      </footer>
    </div>
  );
}
