"use client";

import { useState } from "react";

interface Registration {
  plateNumber: string;
  ownerName: string;
}

export default function Home() {
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber, ownerName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to register plate.');
        return;
      }

      alert(`Plate registered: ${plateNumber} to ${ownerName}`);

      setPlateNumber('');
      setOwnerName('');
    } catch (error) {
      alert('Error connecting to the server.');
      console.error(error);
    }
  };


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="text-2xl font-bold">Simple Plate Registration</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <div>
            <label htmlFor="plate" className="text-sm font-medium block mb-1">
              Plate Number:
            </label>
            <input
              id="plate"
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
              placeholder="e.g. ABC1234"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="owner" className="text-sm font-medium block mb-1">
              Owner Name:
            </label>
            <input
              id="owner"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              placeholder="e.g. John Doe"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Register Plate
          </button>
        </form>
      </main>

      <footer className="row-start-3 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Plate Registry
      </footer>
    </div>
  );
}
