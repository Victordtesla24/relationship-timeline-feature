import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple pass-through middleware
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure the matcher for paths that trigger this middleware
export const config = {
  matcher: [
    // Exclude static files, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 