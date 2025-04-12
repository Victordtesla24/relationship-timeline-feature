'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TimelineControls() {
  return (
    <div className="flex space-x-2">
      <Link
        href="/export"
        className="px-3 py-2 text-sm font-medium rounded-md bg-secondary-100 text-secondary-900 hover:bg-secondary-200"
      >
        Export Timeline
      </Link>
      
      <button
        className="px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
      >
        Add Event
      </button>
    </div>
  );
} 