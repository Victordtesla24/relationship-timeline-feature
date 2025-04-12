'use client';

// Simplified approach with minimal imports for test compatibility
// The current environment has React type issues, so we'll minimize type usage

import React from 'react';
import { format } from 'date-fns';
import MediaUploader from './MediaUploader';

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
  userId: string;
}

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
      const response = await fetch(`/api/media?eventId=${event._id}`);
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data);
      }
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

    fetch(`/api/events/${event._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Failed to update event');
          });
        }
        return response.json();
      })
      .then(updatedEvent => {
        if (onEventUpdated) {
          onEventUpdated(updatedEvent);
        }
      })
      .catch(err => {
        setError(err.message || 'An error occurred while updating the event');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    fetch(`/api/events/${event._id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Failed to delete event');
          });
        }
        
        if (onEventDeleted) {
          onEventDeleted(event._id);
        }
        
        onClose();
      })
      .catch(err => {
        setError(err.message || 'An error occurred while deleting the event');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  const handleMediaAdded = (media: Media) => {
    setMediaItems(prev => [...prev, media]);
  };
  
  const handleMediaDeleted = (mediaId: string) => {
    setMediaItems(prev => prev.filter(item => item._id !== mediaId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>
          
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
            
            <div className="mb-6">
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
            
            <div className="mb-6">
              <MediaUploader
                eventId={event._id}
                mediaItems={mediaItems}
                onMediaAdded={handleMediaAdded}
                onMediaDeleted={handleMediaDeleted}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Delete
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 