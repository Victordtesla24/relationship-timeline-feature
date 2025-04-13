'use client';

import React from 'react';
import Link from 'next/link';
import AddEventModal from './AddEventModal';

export default function TimelineControls() {
  // @ts-ignore - using useState directly from React object due to import errors
  const [isAddEventModalOpen, setIsAddEventModalOpen] = React.useState(false);

  return (
    <div className="flex space-x-2">
      <Link
        href="/export"
        className="px-3 py-2 text-sm font-medium rounded-md bg-secondary-100 text-secondary-900 hover:bg-secondary-200"
      >
        Export Timeline
      </Link>
      
      <button
        onClick={() => setIsAddEventModalOpen(true)}
        className="px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
      >
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