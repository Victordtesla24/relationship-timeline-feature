'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/timeline/EventCard';
import AddEventModal from '@/components/timeline/AddEventModal';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  mediaIds: string[];
  userId: string;
}

export default function Timeline() {
  const { data: session } = useSession();
  // @ts-ignore - using useState directly from React object due to import errors
  const [events, setEvents] = React.useState<Event[]>([]);
  // @ts-ignore - using useState directly from React object due to import errors
  const [isLoading, setIsLoading] = React.useState(true);
  // @ts-ignore - using useState directly from React object due to import errors
  const [error, setError] = React.useState<string | null>(null);
  // @ts-ignore - using useState directly from React object due to import errors
  const [isAddEventModalOpen, setIsAddEventModalOpen] = React.useState(false);

  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.sort((a: Event, b: Event) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleEventAdded = (newEvent: Event) => {
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      return updatedEvents.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      );
      return updatedEvents.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  const handleEventDeleted = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.filter(event => event._id !== eventId)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          role="status" 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <p className="text-red-700">Error loading timeline: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="btn-primary"
        >
          Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your timeline is empty</h3>
          <p className="text-gray-600 mb-4">Start by adding your first event to build your relationship timeline.</p>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="btn-primary"
          >
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          {events.map((event, index) => (
            <EventCard 
              key={event._id} 
              event={event} 
              index={index} 
              onEventUpdated={handleEventUpdated}
              onEventDeleted={handleEventDeleted}
            />
          ))}
        </div>
      )}

      {isAddEventModalOpen && (
        <AddEventModal 
          isOpen={isAddEventModalOpen} 
          onClose={() => setIsAddEventModalOpen(false)} 
          onEventAdded={handleEventAdded}
        />
      )}
    </div>
  );
} 