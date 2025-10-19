import { MongoClient } from 'mongodb';

// Define the shape of a plate registration
type Plate = {
  id: string;
  plateNumber: string;
  ownerName: string;
  createdAt: string;
};

// MongoDB connection utility
async function getPlateRegistrations(): Promise<Plate[]> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  const client = await MongoClient.connect(uri);
  const db = client.db("MongoDB_User"); // You can pass the db name if needed
  const collection = db.collection('registrations'); // Adjust collection name as needed

  const data = await collection.find().toArray();

  const plates = data.map((item) => ({
    id: item._id.toString(),
    plateNumber: item.plateNumber,
    ownerName: item.ownerName,
    createdAt: item.createdAt.toISOString(),
  }));

  await client.close();

  return plates;
}

export default async function AdminPage() {
  const registrations = await getPlateRegistrations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, Admin</h1>
        <p className="text-gray-600 text-sm mb-6">
          This is your dashboard. Manage plate registrations and view data here.
        </p>
        <div className="text-left">
          {registrations.length === 0 ? (
            <p className="text-gray-500">No plates registered yet.</p>
          ) : (
            <ul className="space-y-4">
              {registrations.map((plate) => (
                <li key={plate.id} className="bg-blue-50 p-4 rounded shadow">
                  <p><strong>Plate Number:</strong> {plate.plateNumber}</p>
                  <p><strong>Owner Name:</strong> {plate.ownerName}</p>
                  <p><strong>Created At:</strong> {new Date(plate.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
