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
  // @ts-ignore - using useState directly from React object due to import errors
  const [isHovered, setIsHovered] = React.useState(false);
  
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center z-10 shadow-md transition-all duration-300 ${
          isHovered ? 'scale-110 bg-primary-200' : ''
        } ${isEven ? 'md:order-1 md:ml-6' : 'md:order-1 md:mr-6'}`}
      >
        <span className="text-primary-700 font-semibold text-sm">{index + 1}</span>
      </div>
      
      <div className={`hidden md:block md:w-1/2 ${isEven ? 'md:order-2 md:text-right md:pr-10' : 'md:order-0 md:text-left md:pl-10'}`}>
        <time className="text-gray-500 text-sm font-medium transition-all duration-300 hover:text-primary-600">{formattedDate}</time>
      </div>
      
      <div className={`relative pt-2 pb-4 md:w-1/2 transition-all duration-300 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
        <div 
          className={`p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ${
            isHovered ? 'shadow-md border-primary-100 -translate-y-1' : ''
          }`}
        >
          <div className="md:hidden mb-3 text-sm text-gray-500">{formattedDate}</div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className={`transition-all duration-300 ${isHovered ? 'text-primary-600' : ''}`}>
              {event.title}
            </span>
            {isHovered && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="ml-2 text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Edit event"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </h3>
          <p className="text-gray-700 mb-5 leading-relaxed">{event.description}</p>
          
          {mediaItems.length > 0 && (
            <div className="mt-5 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attachments
              </h4>
              <div className="flex flex-wrap gap-3">
                {mediaItems.map((media, mediaIndex) => (
                  <div 
                    key={media._id} 
                    className="relative group" 
                    style={{ animationDelay: `${mediaIndex * 0.05}s` }}
                  >
                    {media.type === 'image' ? (
                      <a 
                        href={media.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-28 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:ring-2 hover:ring-primary-300 hover:ring-opacity-50"
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
                        className="flex flex-col items-center justify-center w-28 h-28 bg-gray-50 rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-gray-100 hover:border-primary-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-gray-600 mt-2 truncate w-full text-center group-hover:text-primary-700 transition-colors duration-300">
                          {media.name.length > 12 ? `${media.name.substring(0, 12)}...` : media.name}
                        </span>
                      </a>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg opacity-0 group-hover:opacity-100">
                      <a 
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white p-1.5 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transform transition-transform duration-300 hover:scale-110"
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
                  <div className="w-28 h-28 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center animate-pulse">
                    <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-primary-600 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow"
            >
              <svg className="mr-1.5 h-4 w-4 text-gray-500 group-hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Event
            </button>
          </div>
        </div>
      </div>
      
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onEventUpdated={handleEventUpdated}
        onEventDeleted={handleEventDeleted}
      />
    </div>
  );
} 