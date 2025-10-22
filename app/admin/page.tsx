'use client';

import { useEffect, useState } from 'react';

type Plate = {
  id: string;
  plateNumber: string;
  ownerName: string;
  createdAt: string;
};

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Plate[]>([]);
  const [form, setForm] = useState({ plateNumber: '', ownerName: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    const res = await fetch('/api/registration');
    const data = await res.json();
    setRegistrations(data);
  }

  const handleAdd = async () => {
    if (!form.plateNumber || !form.ownerName) return;

    const res = await fetch('/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ plateNumber: '', ownerName: '' });
      fetchRegistrations();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add plate');
    }
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/registration', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchRegistrations();
  };

  const handleEdit = (plate: Plate) => {
    setEditingId(plate.id);
    setForm({ plateNumber: plate.plateNumber, ownerName: plate.ownerName });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, Admin</h1>
        <p className="text-gray-600 text-sm mb-6">Manage plate registrations below.</p>

        {/* Form */}
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
          {editingId ? (
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
              Update
            </button>
          ) : (
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {registrations.length === 0 ? (
            <p className="text-gray-500">No plates registered yet.</p>
          ) : (
            <table className="min-w-full border border-gray-300 text-left text-sm">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="p-3 border-b">Plate Number</th>
                  <th className="p-3 border-b">Owner Name</th>
                  <th className="p-3 border-b">Created At</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((plate) => (
                  <tr key={plate.id} className="hover:bg-blue-50">
                    <td className="p-3 border-b">{plate.plateNumber}</td>
                    <td className="p-3 border-b">{plate.ownerName}</td>
                    <td className="p-3 border-b">
                      {new Date(plate.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 border-b space-x-2">
                      <button
                        onClick={() => handleEdit(plate)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plate.id)}
                        className="text-red-600 hover:underline"
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
