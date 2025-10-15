"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plateNumber, ownerName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to register plate.");
        return;
      }

      alert(`Plate registered: ${plateNumber} to ${ownerName}`);
      setPlateNumber("");
      setOwnerName("");
    } catch (error) {
      alert("Error connecting to the server.");
      console.error("Submit Error:", error);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen p-6 flex flex-col items-center justify-center">
      <main className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Plate Registry</h1>
          <p className="text-sm text-gray-500">Register your vehicle plate below</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="plate" className="text-sm font-medium text-gray-700 block mb-1">
              Plate Number
            </label>
            <input
              id="plate"
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
              placeholder="e.g. ABC1234"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="owner" className="text-sm font-medium text-gray-700 block mb-1">
              Owner Name
            </label>
            <input
              id="owner"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              placeholder="e.g. John Doe"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register Plate
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-blue-600 hover:underline mt-4"
          >
            Admin Login
          </button>
        </div>
      </main>

      <footer className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Plate Registry
      </footer>
    </div>
  );
}
