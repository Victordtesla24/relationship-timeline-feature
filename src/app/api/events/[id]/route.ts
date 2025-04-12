import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

    // Check authorization
    if (event.userId.toString() !== session.user.id && session.user.role !== 'lawyer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return handleApiError(error, 'Error fetching event');
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

    // Check authorization
    if (event.userId.toString() !== session.user.id && session.user.role !== 'lawyer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return handleApiError(error, 'Error updating event');
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

    // Only the owner can delete an event
    if (event.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Event deleted' });
  } catch (error) {
    return handleApiError(error, 'Error deleting event');
  }
} 