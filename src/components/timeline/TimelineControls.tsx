'use client';

import React from 'react';
import Link from 'next/link';
import AddEventModal from './AddEventModal';

export default function TimelineControls() {
  // @ts-ignore - using useState directly from React object due to import errors
  const [isAddEventModalOpen, setIsAddEventModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 animate-slide-in-right">
      <Link
        href="/export"
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 hover:from-secondary-200 hover:to-secondary-300 shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Export Timeline
      </Link>
      
      <button
        onClick={() => setIsAddEventModalOpen(true)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Event
      </button>

      {isAddEventModalOpen && (
        <AddEventModal 
          isOpen={isAddEventModalOpen} 
          onClose={() => setIsAddEventModalOpen(false)} 
          onEventAdded={() => window.location.reload()}
        />
      )}
    </div>
  );
} 