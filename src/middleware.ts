import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't need authentication
const PUBLIC_PATHS = [
  '/api/auth/register',
  '/api/auth/[...nextauth]',
  '/login',
  '/register',
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is public
  if (PUBLIC_PATHS.some(publicPath => {
    if (publicPath.includes('[...')) {
      const basePath = publicPath.split('[')[0];
      return path.startsWith(basePath);
    }
    return path === publicPath;
  })) {
    // If it's a public path, skip authentication check
    return NextResponse.next();
  }

  // For other paths, continue with default behavior
  return NextResponse.next();
}

// Configure the matcher for paths that trigger this middleware
export const config = {
  matcher: [
    // Exclude static files, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 