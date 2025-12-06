'use client';

import { useEffect, useState } from 'react';

// Type for a plate record returned from the API
type Plate = {
  id: string;
  plateNumber: string;
  ownerName: string;
  createdAt: string;
};

export default function AdminPage() {
  // List of all registrations
  const [registrations, setRegistrations] = useState<Plate[]>([]);

  // Form state for creating or editing a plate
  const [form, setForm] = useState({ plateNumber: '', ownerName: '' });

  // Tracks which plate ID is currently being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search query to filter plates
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial registration data on page load
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Reset editing mode if both inputs are cleared
  useEffect(() => {
    if (!form.plateNumber.trim() && !form.ownerName.trim()) {
      setEditingId(null);
    }
  }, [form.plateNumber, form.ownerName]);

  // Fetch all plate registrations from backend
  async function fetchRegistrations() {
    const res = await fetch('/api/registration');
    const data = await res.json();
    setRegistrations(data);
  }

  // Add a new plate registration
  const handleAdd = async () => {
    if (!form.plateNumber || !form.ownerName) return;

    const res = await fetch('/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ plateNumber: '', ownerName: '' });
      fetchRegistrations(); // Refresh list
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add plate');
    }
  };

  // Delete a plate by ID
  const handleDelete = async (id: string) => {
    await fetch('/api/registration', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    fetchRegistrations();
  };

  // Fill form for editing a selected plate
  const handleEdit = (plate: Plate) => {
    setEditingId(plate.id);
    setForm({ plateNumber: plate.plateNumber, ownerName: plate.ownerName });
  };

  // Update an existing plate
  const handleUpdate = async () => {
    if (!editingId) return;

    await fetch('/api/registration', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, ...form }),
    });

    setEditingId(null);
    setForm({ plateNumber: '', ownerName: '' });
    fetchRegistrations();
  };

  // Filter plates based on search input (plate number or owner name)
  const filteredPlates = registrations.filter(
    (plate) =>
      plate.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, Admin</h1>
        <p className="text-gray-600 text-sm mb-6">Manage plate registrations below.</p>

        {/* Search bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by plate number or owner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Input form for adding or editing plates */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
          <input
            type="text"
            placeholder="Plate Number"
            value={form.plateNumber}
            onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
            className="border px-4 py-2 rounded w-full sm:w-1/3"
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            className="border px-4 py-2 rounded w-full sm:w-1/3"
          />

          {/* Show update buttons when editing, otherwise show add buttons */}
          {editingId ? (
            <>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                Update
              </button>
              <button
                onClick={() => {
                  setForm({ plateNumber: '', ownerName: '' });
                  setEditingId(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
            </>
          ) : (
            <>
              <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
              <button
                onClick={() => setForm({ plateNumber: '', ownerName: '' })}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Scrollable table of plate registrations */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-md border border-gray-300 shadow-sm">
          {filteredPlates.length === 0 ? (
            <p className="text-gray-500 p-4">No matching plates found.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-blue-100 text-blue-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 border-b border-gray-300">Plate Number</th>
                  <th className="p-3 border-b border-gray-300">Owner Name</th>
                  <th className="p-3 border-b border-gray-300">Created At</th>
                  <th className="p-3 border-b border-gray-300">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlates.map((plate, index) => (
                  <tr
                    key={plate.id}
                    className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-3 border-b border-gray-300">{plate.plateNumber}</td>
                    <td className="p-3 border-b border-gray-300">{plate.ownerName}</td>

                    {/* Format date for readable display */}
                    <td className="p-3 border-b border-gray-300">
                      {new Date(plate.createdAt).toLocaleString()}
                    </td>

                    {/* Edit and delete actions */}
                    <td className="p-3 border-b border-gray-300 space-x-3">
                      <button
                        onClick={() => handleEdit(plate)}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(plate.id)}
                        className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
