// app/api/registration/route.ts

// before installing mongodb (Remove-Item -Recurse -Force node_modules, package-lock.json)
// npm install --legacy-peer-deps
// npm install mongodb

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  const { plateNumber, ownerName } = await request.json();

  if (!plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User'); // your DB name
    const collection = db.collection('registrations');

    // Check for existing plate number
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
