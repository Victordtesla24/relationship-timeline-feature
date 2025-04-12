import { NextResponse } from 'next/server';
import { testUser } from '@/lib/seed-data';

// This API route is for development use only
export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    id: testUser.id,
    name: testUser.name,
    email: testUser.email,
    role: 'user',
  });
} 