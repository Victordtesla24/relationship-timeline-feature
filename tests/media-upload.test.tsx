import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaUploader from '@/components/timeline/MediaUploader';
import { useSession } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react');

// Mock fetch API
global.fetch = jest.fn();

describe('MediaUploader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: { 
        user: { 
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'client'
        }
      },
      status: 'authenticated'
    });
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
}); 