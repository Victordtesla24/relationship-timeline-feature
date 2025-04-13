import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditEventModal from '@/components/timeline/EditEventModal';
import { format } from 'date-fns';
import * as localStorage from '@/utils/localStorage';

// Mock the localStorage functions
jest.mock('@/utils/localStorage', () => ({
  getMediaItems: jest.fn(() => []),
  updateEvent: jest.fn((id, data) => ({
    _id: id,
    ...data,
    mediaIds: [],
    updatedAt: new Date().toISOString()
  })),
  deleteEvent: jest.fn(() => true)
}));

// Mock the MediaUploader component
jest.mock('@/components/timeline/MediaUploader', () => {
  return jest.fn(({ eventId, mediaItems }) => (
    <div data-testid="media-uploader">
      <div>Event ID: {eventId}</div>
      <div>Media Items: {mediaItems.length}</div>
    </div>
  ));
});

// Mock window.confirm
window.confirm = jest.fn().mockImplementation(() => true);

describe('EditEventModal', () => {
  const mockEvent = {
    _id: 'event123',
    title: 'Test Event',
    description: 'Test Description',
    date: '2023-01-01T00:00:00.000Z',
    mediaIds: ['media1', 'media2'],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    commentIds: []
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
    // Setup mock returns
    (localStorage.getMediaItems as jest.Mock).mockReturnValue(mockMediaItems);
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
      expect(screen.getByLabelText('Event Title')).toHaveValue('Test Event');
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

    // Using a more basic approach with strict equality check
    const element = screen.queryByText('Edit Event');
    expect(element).toBe(null);
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
    const mockUpdatedEvent = { 
      ...mockEvent, 
      title: 'Updated Title',
      description: 'Test Description',
      date: '2023-01-01',
      updatedAt: new Date().toISOString()
    };
    
    (localStorage.updateEvent as jest.Mock).mockReturnValue(mockUpdatedEvent);

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
      const titleInput = screen.getByLabelText('Event Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      
      // Submit form - use the actual button text in the component
      fireEvent.click(screen.getByText('Save Changes'));
    });

    await waitFor(() => {
      expect(localStorage.updateEvent).toHaveBeenCalledWith(mockEvent._id, expect.any(Object));
      expect(mockOnEventUpdated).toHaveBeenCalledWith(mockUpdatedEvent);
    });
  });

  it('handles deletion and calls onEventDeleted', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (localStorage.deleteEvent as jest.Mock).mockReturnValue(true);

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
      fireEvent.click(screen.getByText('Delete Event'));
    });

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(localStorage.deleteEvent).toHaveBeenCalledWith(mockEvent._id);
      expect(mockOnEventDeleted).toHaveBeenCalledWith(mockEvent._id);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays error message when update fails', async () => {
    const errorMessage = 'Failed to update event';
    (localStorage.updateEvent as jest.Mock).mockReturnValue(null);

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
      // Use the actual button text in the component
      fireEvent.click(screen.getByText('Save Changes'));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnEventUpdated).not.toHaveBeenCalled();
    });
  });
}); 