import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditEventModal from '@/components/timeline/EditEventModal';
import { format } from 'date-fns';

// Mock the MediaUploader component
jest.mock('@/components/timeline/MediaUploader', () => {
  return jest.fn(({ eventId, mediaItems }) => (
    <div data-testid="media-uploader">
      <div>Event ID: {eventId}</div>
      <div>Media Items: {mediaItems.length}</div>
    </div>
  ));
});

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'mock-user-id' } },
    status: 'authenticated',
  }),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.confirm
jest.spyOn(window, 'confirm').mockImplementation(() => true);

describe('EditEventModal', () => {
  const mockEvent = {
    _id: 'event123',
    title: 'Test Event',
    description: 'Test Description',
    date: '2023-01-01T00:00:00.000Z',
    mediaIds: ['media1', 'media2'],
    userId: 'user123',
  };

  const mockMediaItems = [
    { _id: 'media1', url: 'http://example.com/media1', type: 'image', filename: 'image.jpg' },
    { _id: 'media2', url: 'http://example.com/media2', type: 'document', filename: 'doc.pdf' },
  ];

  const mockOnClose = jest.fn();
  const mockOnEventUpdated = jest.fn();
  const mockOnEventDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch for media items
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/media?eventId=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMediaItems),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it('renders the modal when isOpen is true', async () => {
    render(
      <EditEventModal
        event={mockEvent}
        isOpen={true}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Event')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toHaveValue('Test Event');
      expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
      expect(screen.getByLabelText('Date')).toHaveValue(format(new Date(mockEvent.date), 'yyyy-MM-dd'));
      expect(screen.getByTestId('media-uploader')).toBeInTheDocument();
    });
  });

  it('does not render the modal when isOpen is false', () => {
    render(
      <EditEventModal
        event={mockEvent}
        isOpen={false}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    expect(screen.queryByText('Edit Event')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(
      <EditEventModal
        event={mockEvent}
        isOpen={true}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('submits the form and calls onEventUpdated', async () => {
    const mockUpdatedEvent = { ...mockEvent, title: 'Updated Title' };
    
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes(`/api/events/${mockEvent._id}`) && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUpdatedEvent),
        });
      }
      if (url.includes('/api/media?eventId=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMediaItems),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <EditEventModal
        event={mockEvent}
        isOpen={true}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    await waitFor(() => {
      // Update title
      const titleInput = screen.getByLabelText('Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/events/${mockEvent._id}`, expect.any(Object));
      expect(mockOnEventUpdated).toHaveBeenCalledWith(mockUpdatedEvent);
    });
  });

  it('handles deletion and calls onEventDeleted', async () => {
    (global.confirm as jest.Mock).mockReturnValue(true);
    
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes(`/api/events/${mockEvent._id}`) && options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      if (url.includes('/api/media?eventId=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMediaItems),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <EditEventModal
        event={mockEvent}
        isOpen={true}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(`/api/events/${mockEvent._id}`, expect.any(Object));
      expect(mockOnEventDeleted).toHaveBeenCalledWith(mockEvent._id);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays error message when update fails', async () => {
    const errorMessage = 'Failed to update event';
    
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes(`/api/events/${mockEvent._id}`) && options.method === 'PUT') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: errorMessage }),
        });
      }
      if (url.includes('/api/media?eventId=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMediaItems),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(
      <EditEventModal
        event={mockEvent}
        isOpen={true}
        onClose={mockOnClose}
        onEventUpdated={mockOnEventUpdated}
        onEventDeleted={mockOnEventDeleted}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnEventUpdated).not.toHaveBeenCalled();
    });
  });
}); 