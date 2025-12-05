// app/api/registration/route.ts

// before installing mongodb (Remove-Item -Recurse -Force node_modules, package-lock.json)
// npm install --legacy-peer-deps
// npm install mongodb

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Load the MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI!;

// Create a new MongoDB client instance
const client = new MongoClient(uri);

/**
 * POST — Register a new license plate
 */
export async function POST(request: NextRequest) {
  // Parse JSON body from the request
  const { plateNumber, ownerName } = await request.json();

  // Validate required fields
  if (!plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('MongoDB_User'); // Database name
    const collection = db.collection('registrations'); // Collection name

    // Check if the plate number already exists in the DB
    const existing = await collection.findOne({ plateNumber: plateNumber.trim() });
    if (existing) {
      return NextResponse.json(
        { error: 'Plate number already registered' },
        { status: 409 }
      );
    }

    // Insert the new registration into MongoDB
    const result = await collection.insertOne({
      plateNumber: plateNumber.trim(),
      ownerName: ownerName.trim(),
      createdAt: new Date(),
    });

    // Return success response with inserted document ID
    return NextResponse.json({
      message: 'Plate registered successfully',
      id: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    // Handle any database errors
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    // Always close the MongoDB connection
    await client.close();
  }
}
