import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';
import Media from '@/models/media';
import { handleApiError } from '@/lib/api-error';

// Simple utility to generate a unique filename
const generateUniqueFilename = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const mediaId = searchParams.get('id');
    
    if (mediaId) {
      // Fetch a specific media item
      const media = await Media.findById(mediaId);
      if (!media) {
        return NextResponse.json({ message: 'Media not found' }, { status: 404 });
      }
      
      // Verify the media belongs to an event owned by the user
      const event = await Event.findById(media.eventId);
      if (!event || event.userId.toString() !== (session.user as any).id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }
      
      return NextResponse.json(media);
    } else if (eventId) {
      // Fetch all media for a specific event
      const event = await Event.findById(eventId);
      if (!event) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
      
      // Verify the event belongs to the user
      if (event.userId.toString() !== (session.user as any).id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }
      
      const mediaItems = await Media.find({ eventId });
      return NextResponse.json(mediaItems);
    } else {
      return NextResponse.json({ message: 'Missing eventId or id parameter' }, { status: 400 });
    }
  } catch (error) {
    return handleApiError(error, 'Error fetching media');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Process the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventId = formData.get('eventId') as string;
    
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }
    
    if (!eventId) {
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    // Special handling for temporary event IDs created on frontend
    if (eventId.startsWith('temp-')) {
      // For temporary events, we'll still create the media item
      // but won't validate the event owner or add to event.mediaIds
      
      // Get file type and determine media type
      const type = file.type.startsWith('image/') ? 'image' : 'document';
      
      // Simulate file upload and store metadata
      const filename = generateUniqueFilename(file.name);
      
      // Generate a temporary URL for the frontend
      // In production, this would be a real upload to Cloudinary or similar
      const url = `/uploads/${filename}`;

      // Create media record but mark it as temporary
      const media = {
        _id: `temp-media-${Date.now()}`,
        url: url,
        type: type,
        filename: file.name,
        eventId: eventId
      };

      return NextResponse.json(media, { status: 201 });
    }

    // For real events, continue with normal validation
    // Verify the event belongs to the user
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    if (event.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get file type and determine media type
    const type = file.type.startsWith('image/') ? 'image' : 'document';
    
    // In a production app, you'd upload to a cloud storage service like Cloudinary
    // For this implementation, we'll simulate storing the file and generate a URL
    
    // Simulate file upload and store metadata
    const filename = generateUniqueFilename(file.name);
    const fileBuffer = await file.arrayBuffer();
    
    // Store the file in a public directory or cloud storage
    // For demo purposes, we're creating a fake URL
    const url = `/uploads/${filename}`;

    // Create media record in database
    const media = await Media.create({
      url,
      type,
      filename: file.name,
      eventId,
    });

    // Add media ID to the event's mediaIds array
    await Event.findByIdAndUpdate(
      eventId,
      { $push: { mediaIds: media._id } },
      { new: true }
    );

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Error uploading file');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('id');
    
    if (!mediaId) {
      return NextResponse.json({ message: 'Media ID is required' }, { status: 400 });
    }
    
    // Special handling for temporary media IDs
    if (mediaId.startsWith('temp-')) {
      // For temporary media items, we don't need to update the database
      // Just return success since these aren't stored in the database
      return NextResponse.json({ message: 'Temporary media deleted successfully' });
    }
    
    // Find the media item
    const media = await Media.findById(mediaId);
    if (!media) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }
    
    // Verify the media belongs to an event owned by the user
    const event = await Event.findById(media.eventId);
    if (!event || event.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    // Remove media ID from the event's mediaIds array
    await Event.findByIdAndUpdate(
      media.eventId,
      { $pull: { mediaIds: media._id } },
      { new: true }
    );
    
    // Delete the media record
    await Media.findByIdAndDelete(mediaId);
    
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Error deleting media');
  }
} 