export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome, Admin
        </h1>
        <p className="text-gray-600 text-sm">
          This is your dashboard. Manage plate registrations and view data here.
        </p>
      </div>
    </div>
  );
}
