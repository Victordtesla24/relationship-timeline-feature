'use client';

import React from 'react';
import Link from 'next/link';

export default function TimelineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Timeline error:', error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-red-500 mr-2"
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
          <h2 className="text-xl font-semibold text-red-700">Timeline Error</h2>
        </div>
        
        <div className="text-red-600 mb-4 text-sm">
          {error.message || 'An error occurred while loading your timeline'}
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            href="/"
            className="text-red-600 hover:text-red-800 font-medium underline"
          >
            Go to Home
          </Link>
          
          <button
            onClick={reset}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
} 