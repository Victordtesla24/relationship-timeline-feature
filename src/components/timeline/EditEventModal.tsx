'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import { format } from 'date-fns';
import MediaUploader from './MediaUploader';
import { updateEvent, deleteEvent, Event, Media, getMediaItems } from '@/utils/localStorage';

interface EditEventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated?: (updatedEvent: Event) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function EditEventModal({ 
  event, 
  isOpen, 
  onClose, 
  onEventUpdated, 
  onEventDeleted 
}: EditEventModalProps) {
  // @ts-ignore - using useState directly from React object due to import errors
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
  });

  // @ts-ignore - using useState directly from React object due to import errors
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [error, setError] = React.useState('');
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [mediaItems, setMediaItems] = React.useState<Media[]>([]);

  // Initialize form with event data
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: format(new Date(event.date), 'yyyy-MM-dd'),
      });
      
      // Fetch media items for this event
      fetchMediaItems();
    }
  }, [event]);

  const fetchMediaItems = async () => {
    try {
      // Get media items directly from localStorage
      const media = getMediaItems(event._id);
      setMediaItems(media);
    } catch (err) {
      console.error('Error fetching media items:', err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get the current media IDs from our local state
      const currentMediaIds = mediaItems.map(item => item._id);
      
      // Update event directly in localStorage with current media IDs
      const updatedEvent = updateEvent(event._id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        mediaIds: currentMediaIds, // Use the current media IDs
      });

      if (!updatedEvent) {
        throw new Error('Failed to update event');
      }

      if (onEventUpdated) {
        onEventUpdated(updatedEvent);
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the event');
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Make sure we have a valid event ID
      if (!event || !event._id) {
        throw new Error('Invalid event data');
      }

      // Delete event directly from localStorage
      const success = deleteEvent(event._id);
      
      if (!success) {
        throw new Error('Failed to delete event');
      }
      
      // Call the onEventDeleted callback if provided
      if (onEventDeleted) {
        try {
          onEventDeleted(event._id);
        } catch (callbackError) {
          console.error('Error in onEventDeleted callback:', callbackError);
          // Continue with closing the modal even if the callback has an error
        }
      }
      
      // Close the modal in all cases after successful deletion
      onClose();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message || 'An error occurred while deleting the event');
      setIsSubmitting(false);
    }
  };
  
  const handleMediaAdded = (media: Media) => {
    // Update local state
    setMediaItems(prev => [...prev, media]);
    
    // Update the event's mediaIds array
    const updatedMediaIds = [...(event.mediaIds || []), media._id];
    event.mediaIds = updatedMediaIds;
  };
  
  const handleMediaDeleted = (mediaId: string) => {
    // Update local state
    setMediaItems(prev => prev.filter(item => item._id !== mediaId));
    
    // Update the event's mediaIds array
    const updatedMediaIds = (event.mediaIds || []).filter(id => id !== mediaId);
    event.mediaIds = updatedMediaIds;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden"
        role="document"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
          <h2 
            id="edit-modal-title"
            className="text-xl font-bold text-white"
          >
            Edit Event
          </h2>
          <p className="text-primary-100 text-sm mt-1">Update details of this relationship milestone</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div 
              className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate-slide-in-bottom"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
                required
                aria-label="Event Title"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
                required
                aria-label="Date"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
                required
                aria-label="Description"
              />
            </div>
            
            <div className="pt-2">
              <MediaUploader
                eventId={event._id}
                mediaItems={mediaItems}
                onMediaAdded={handleMediaAdded}
                onMediaDeleted={handleMediaDeleted}
              />
            </div>
            
            <div className="pt-4 flex justify-between border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete Event
                  </>
                )}
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 