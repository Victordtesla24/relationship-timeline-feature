import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';
import { authOptions } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed-data';
import { handleApiError } from '@/lib/api-error';

// Seed the database in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
  seedDatabase().catch(err => console.error('Error seeding database:', err));
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const events = await Event.find({ userId: session.user.id });

    return NextResponse.json(events);
  } catch (error) {
    return handleApiError(error, 'Error fetching events');
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    
    // Create the event
    const event = await Event.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Error creating event');
  }
} 