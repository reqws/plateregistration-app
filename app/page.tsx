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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if plate number already exists
    const exists = registrations.some((r) => r.plateNumber === plateNumber.trim());

    if (exists) {
      alert("Error: This plate number is already registered.");
      return;
    }

    // Add new registration
    const newRegistration: Registration = {
      plateNumber: plateNumber.trim(),
      ownerName: ownerName.trim(),
    };

    setRegistrations([...registrations, newRegistration]);
    alert(`Plate registered: ${plateNumber} to ${ownerName}`);

    // Clear fields
    setPlateNumber("");
    setOwnerName("");
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
