'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import EditEventModal from './EditEventModal';
import { Event, getMediaItems } from '@/utils/localStorage';

interface Media {
  _id: string;
  url: string;
  type: string;
  name: string;
  eventId: string;
  createdAt: string;
}

interface EventCardProps {
  event: Event;
  index: number;
  onEventUpdated?: (event: Event) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function EventCard({ event, index, onEventUpdated, onEventDeleted }: EventCardProps) {
  // @ts-ignore - using useState directly from React object due to import errors
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  // @ts-ignore - using useState directly from React object due to import errors
  const [mediaItems, setMediaItems] = React.useState<Media[]>([]);
  // @ts-ignore - using useState directly from React object due to import errors
  const [isLoadingMedia, setIsLoadingMedia] = React.useState(false);
  
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    if (event.mediaIds && event.mediaIds.length > 0) {
      fetchMediaItems();
    }
  }, [event]);
  
  const fetchMediaItems = async () => {
    try {
      setIsLoadingMedia(true);
      // Get media items directly from localStorage
      const media = getMediaItems(event._id);
      setMediaItems(media);
    } catch (err) {
      console.error('Error fetching media items:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };
  
  const handleEventUpdated = (updatedEvent: Event) => {
    if (onEventUpdated) {
      onEventUpdated(updatedEvent);
    }
    
    // Refresh media items
    if (updatedEvent.mediaIds && updatedEvent.mediaIds.length > 0) {
      fetchMediaItems();
    } else {
      setMediaItems([]);
    }
    
    setIsEditModalOpen(false);
  };
  
  const handleEventDeleted = (eventId: string) => {
    if (onEventDeleted) {
      onEventDeleted(eventId);
    }
  };
  
  const formattedDate = format(parseISO(event.date), 'MMMM d, yyyy');
  const isEven = index % 2 === 0;
  
  return (
    <div 
      className={`flex items-start md:items-center justify-between md:justify-start md:justify-normal`}
      data-testid={`event-card-${index}`}
    >
      <div className={`w-10 h-10 flex-shrink-0 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center z-10 ${isEven ? 'md:order-1 md:ml-6' : 'md:order-1 md:mr-6'}`}>
        <span className="text-primary-700 font-semibold text-sm">{index + 1}</span>
      </div>
      
      <div className={`hidden md:block md:w-1/2 ${isEven ? 'md:order-2 md:text-right md:pr-10' : 'md:order-0 md:text-left md:pl-10'}`}>
        <time className="text-gray-600 text-sm font-medium">{formattedDate}</time>
      </div>
      
      <div className={`relative pt-2 pb-4 md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
          <div className="md:hidden mb-2 text-sm text-gray-500">{formattedDate}</div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-700 mb-4">{event.description}</p>
          
          {mediaItems.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {mediaItems.map((media) => (
                  <div key={media._id} className="relative group">
                    {media.type === 'image' ? (
                      <a 
                        href={media.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-24 h-24 bg-gray-100 rounded-md overflow-hidden"
                      >
                        <img 
                          src={media.url} 
                          alt={media.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, set a placeholder
                            (e.target as HTMLImageElement).src = '/images/placeholder-image.svg';
                            (e.target as HTMLImageElement).onerror = null; // Prevent infinite loops
                          }}
                        />
                      </a>
                    ) : (
                      <a 
                        href={media.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 rounded-md p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">
                          {media.name.length > 10 ? `${media.name.substring(0, 10)}...` : media.name}
                        </span>
                      </a>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity rounded-md opacity-0 group-hover:opacity-100">
                      <a 
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
                
                {isLoadingMedia && (
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1 rounded-md hover:bg-primary-50"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditEventModal
          event={event}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      )}
    </div>
  );
} 