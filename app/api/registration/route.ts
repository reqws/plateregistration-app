// app/api/registration/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    const data = await collection.find().toArray();

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
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  const { plateNumber, ownerName } = await request.json();

  if (!plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    const existing = await collection.findOne({ plateNumber: plateNumber.trim() });
    if (existing) {
      return NextResponse.json({ error: 'Plate number already registered' }, { status: 409 });
    }

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

export async function PUT(request: NextRequest) {
  const { id, plateNumber, ownerName } = await request.json();

  if (!id || !plateNumber || !ownerName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { plateNumber: plateNumber.trim(), ownerName: ownerName.trim() } }
    );

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

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db('MongoDB_User');
    const collection = db.collection('registrations');

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
