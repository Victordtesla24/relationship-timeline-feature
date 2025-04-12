'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center mb-6">
              <svg
                className="h-8 w-8 text-red-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Critical Application Error</h1>
            </div>

            <div className="mb-6">
              <p className="text-red-600 mb-4">
                {error.message || 'An unexpected error occurred'}
              </p>
              <p className="text-gray-600">
                The application encountered a critical error and could not continue.
                Try refreshing the page or clicking the button below.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 