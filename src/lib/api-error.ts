import { NextResponse } from 'next/server';

/**
 * Unified error handler for API routes
 * @param error The error object from the catch block
 * @param defaultMessage A default message to show if the error doesn't have one
 * @param statusCode The HTTP status code to return
 * @returns A NextResponse object with the error details
 */
export function handleApiError(
  error: unknown, 
  defaultMessage = 'An unexpected error occurred', 
  statusCode = 500
) {
  // Log the error for server-side debugging
  console.error('API Error:', error);
  
  // Extract the error message
  let message = defaultMessage;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  // Return a consistent error response
  return NextResponse.json(
    { 
      error: true, 
      message, 
      timestamp: new Date().toISOString(),
      // Add stack trace in development mode only
      ...(process.env.NODE_ENV === 'development' && error instanceof Error 
        ? { stack: error.stack } 
        : {})
    },
    { status: statusCode }
  );
} 