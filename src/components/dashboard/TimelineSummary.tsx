'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TimelineSummary() {
  const [eventCount, setEventCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const events = await response.json();
          setEventCount(events.length);
        }
      } catch (error) {
        console.error('Error fetching timeline summary', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSummary();
  }, []);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Timeline Summary</h2>
      
      {isLoading ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Events</span>
            <span className="text-2xl font-bold">{eventCount}</span>
          </div>
          
          <Link 
            href="/timeline" 
            className="block text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md mt-4"
          >
            View Timeline
          </Link>
        </div>
      )}
    </div>
  );
} 