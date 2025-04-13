'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import Link from 'next/link';
import EventCard from '@/components/timeline/EventCard';
import AddEventModal from '@/components/timeline/AddEventModal';
import { Event, getEvents } from '@/utils/localStorage';

interface TimelineProps {
  relationshipId?: string;
}

export default function Timeline({ relationshipId }: TimelineProps = {}) {
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
        // Get events directly from localStorage
        const allEvents = getEvents();
        
        // Sort events by date
        const sortedEvents = allEvents.sort((a: Event, b: Event) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setEvents(sortedEvents);
      } catch (err: any) {
        setError(err.message || 'Error loading events');
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
        <div className="flex flex-col items-center">
          <div 
            role="status" 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
            aria-label="Loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading your timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md my-6 animate-fade-in">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-md font-semibold text-red-800">Error loading timeline</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in" data-testid="timeline">
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4 md:mb-0 animate-slide-in-left">
          Your Relationship Timeline
        </h2>
        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 animate-slide-in-right"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-md transition-all hover:shadow-lg animate-slide-up">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-3">Your timeline is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">Start by adding your first event to build your relationship timeline. Document special moments, dates, and memories.</p>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary-400 before:to-transparent">
          {events.map((event, index) => (
            <div key={event._id} className={`animate-slide-up delay-${(index % 5) * 100}`} style={{animationDelay: `${index * 0.1}s`}}>
              <EventCard 
                event={event} 
                index={index} 
                onEventUpdated={handleEventUpdated}
                onEventDeleted={handleEventDeleted}
              />
            </div>
          ))}
        </div>
      )}

      {isAddEventModalOpen && (
        <AddEventModal 
          isOpen={isAddEventModalOpen} 
          onClose={() => setIsAddEventModalOpen(false)} 
          onEventAdded={handleEventAdded}
          relationshipId={relationshipId}
        />
      )}
    </div>
  );
} 