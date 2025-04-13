'use client';

import React from 'react';
import Link from 'next/link';

interface TimelineControlsProps {
  relationshipId?: string;
}

export default function TimelineControls({ relationshipId }: TimelineControlsProps) {
  // Build the export URL with the relationshipId if available
  const exportUrl = relationshipId 
    ? `/export?relationshipId=${relationshipId}` 
    : '/export';

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 animate-slide-in-right" data-testid="timeline-controls">
      <Link
        href={exportUrl}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 hover:from-secondary-200 hover:to-secondary-300 shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Export Timeline
      </Link>
    </div>
  );
} 