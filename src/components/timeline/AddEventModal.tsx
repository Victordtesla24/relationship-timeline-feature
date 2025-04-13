'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import { format } from 'date-fns';
import MediaUploader from './MediaUploader';
import { createEvent, Event as StorageEvent } from '@/utils/localStorage';

interface Media {
  _id: string;
  url: string;
  type: 'image' | 'document';
  filename: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  mediaIds: string[];
  relationshipId?: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded?: (event: Event) => void;
  relationshipId?: string;
}

export default function AddEventModal({ isOpen, onClose, onEventAdded, relationshipId }: AddEventModalProps) {
  // @ts-ignore - using useState directly from React object due to import errors
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    relationshipId: relationshipId || null,
  });
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [error, setError] = React.useState('');
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [newEventId, setNewEventId] = React.useState<string | null>(null);
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [mediaItems, setMediaItems] = React.useState<Media[]>([]);
  
  // @ts-ignore - using useState directly from React object due to import errors
  const [tempEventId, setTempEventId] = React.useState<string>(`temp-${Date.now()}`);

  // Update formData if relationshipId prop changes
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    if (relationshipId) {
      setFormData(prev => ({ ...prev, relationshipId }));
    }
  }, [relationshipId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create event directly in localStorage
      const newEvent = createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        mediaIds: mediaItems.map(m => m._id),
      });

      setNewEventId(newEvent._id);
      
      // If we have media items
      if (mediaItems.length > 0) {
        // Update the frontend immediately
        if (onEventAdded) {
          onEventAdded(newEvent);
        }
      } else {
        if (onEventAdded) {
          onEventAdded(newEvent);
        }
      }
      
      // Close the modal
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the event');
      setIsSubmitting(false);
    }
  };
  
  const handleMediaAdded = (media: Media) => {
    setMediaItems(prev => [...prev, media]);
  };
  
  const handleMediaDeleted = (mediaId: string) => {
    setMediaItems(prev => prev.filter(item => item._id !== mediaId));
  };
  
  const handleClose = () => {
    // Reset the form when closing
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      relationshipId: relationshipId || null,
    });
    setNewEventId(null);
    setMediaItems([]);
    setTempEventId(`temp-${Date.now()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <MediaUploader
                eventId={newEventId || tempEventId}
                mediaItems={mediaItems}
                onMediaAdded={handleMediaAdded}
                onMediaDeleted={handleMediaDeleted}
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 