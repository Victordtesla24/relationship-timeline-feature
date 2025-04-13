import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MediaUploader from '@/components/timeline/MediaUploader';

// Mock fetch API
global.fetch = jest.fn();

describe('MediaUploader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the uploader correctly', () => {
    render(
      <MediaUploader 
        eventId="event-1" 
        mediaItems={[]}
      />
    );
    
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByText('Add File')).toBeInTheDocument();
  });
  
  it('renders existing media items', () => {
    const mediaItems = [
      {
        _id: 'media-1',
        url: '/uploads/test-image.jpg',
        type: 'image',
        filename: 'test-image.jpg'
      },
      {
        _id: 'media-2',
        url: '/uploads/test-doc.pdf',
        type: 'document',
        filename: 'test-doc.pdf'
      }
    ];
    
    render(
      <MediaUploader 
        eventId="event-1" 
        mediaItems={mediaItems}
      />
    );
    
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('test-doc.pdf')).toBeInTheDocument();
  });
  
  it('handles temp event IDs for new events', () => {
    const tempEventId = 'temp-12345';
    
    // Mock the fetch response for temporary event uploads
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'temp-media-123',
        url: '/uploads/test-temp.jpg',
        type: 'image',
        filename: 'test-temp.jpg',
        eventId: tempEventId
      })
    });
    
    render(
      <MediaUploader 
        eventId={tempEventId}
        mediaItems={[]}
      />
    );
    
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByText('Add File')).toBeInTheDocument();
  });
  
  it('displays image files correctly', async () => {
    const mediaItems = [
      {
        _id: 'media-3',
        url: '/uploads/missing-image.jpg',
        type: 'image',
        filename: 'missing-image.jpg'
      }
    ];
    
    render(
      <MediaUploader 
        eventId="event-1" 
        mediaItems={mediaItems}
      />
    );
    
    // Check for the filename in the link
    expect(screen.getByText('missing-image.jpg')).toBeInTheDocument();
    
    // Check that the link points to the correct URL
    const link = screen.getByText('missing-image.jpg').closest('a');
    expect(link).toHaveAttribute('href', '/uploads/missing-image.jpg');
    
    // Check for the image emoji indicator
    expect(screen.getByText('🖼️')).toBeInTheDocument();
  });
}); 