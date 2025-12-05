// app/api/registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// Load MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

/**
 * GET — Fetch all registered plates
 */
export async function GET() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    // Retrieve all documents
    const data = await collection.find().toArray();

    // Transform data into cleaner response format
    const plates = data.map((item) => ({
      id: item._id.toString(),
      plateNumber: item.plateNumber,
      ownerName: item.ownerName,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json(plates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    // Always close the DB connection
    await client.close();
  }
}

/**
 * POST — Add a new plate registration
 */
export async function POST(request: NextRequest) {
  // Parse request body
  const { plateNumber, ownerName } = await request.json();

  // Validate incoming fields
  if (!plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    // Check if plate number already exists
    const existing = await collection.findOne({ plateNumber: plateNumber.trim() });
    if (existing) {
      return NextResponse.json({ error: 'Plate number already registered' }, { status: 409 });
    }

    // Insert new registration
    const result = await collection.insertOne({
      plateNumber: plateNumber.trim(),
      ownerName: ownerName.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Plate registered successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

/**
 * PUT — Update an existing plate registration
 */
export async function PUT(request: NextRequest) {
  const { id, plateNumber, ownerName } = await request.json();

  // Validate required fields
  if (!id || !plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    // Update record by ID
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { plateNumber: plateNumber.trim(), ownerName: ownerName.trim() } }
    );

    // Check if update was successful
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Update failed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plate updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

/**
 * DELETE — Remove a plate registration
 */
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  // Validate ID
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    // Delete record by ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plate deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
