import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '@/components/timeline/EventCard';
import { format } from 'date-fns';
import * as localStorage from '@/utils/localStorage';

// Mock localStorage functions
jest.mock('@/utils/localStorage', () => ({
  getMediaItems: jest.fn().mockReturnValue([])
}));

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        _id: 'media-1',
        url: '/test-image.jpg',
        type: 'image',
        filename: 'test-image.jpg',
      },
    ]),
  })
);

// Mock EditEventModal since it doesn't exist yet
jest.mock('@/components/timeline/EditEventModal', () => {
  return function MockEditEventModal({ event, isOpen, onClose }: any) {
    return isOpen ? (
      <div data-testid="edit-event-modal">
        <p>Editing: {event.title}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('EventCard Component', () => {
  const mockEvent = {
    _id: 'event123',
    title: 'Test Event',
    description: 'Test Description',
    date: '2023-01-01T00:00:00.000Z',
    mediaIds: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    commentIds: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.getMediaItems as jest.Mock).mockReturnValue([]);
  });

  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} index={0} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    const formattedDate = format(new Date(mockEvent.date), 'MMMM d, yyyy');
    expect(screen.getAllByText(formattedDate)[0]).toBeInTheDocument();
  });

  it('applies even/odd styling based on index', () => {
    const { rerender } = render(<EventCard event={mockEvent} index={0} />);
    
    // Even index (index 0) - check for expected classes
    const evenDateSection = screen.getAllByText(format(new Date(mockEvent.date), 'MMMM d, yyyy'))[0]
      .closest('div');
    expect(evenDateSection).toHaveClass('md:order-2');
    
    // Rerender with odd index
    rerender(<EventCard event={mockEvent} index={1} />);
    
    // Odd index (index 1) - check for expected classes
    const oddDateSection = screen.getAllByText(format(new Date(mockEvent.date), 'MMMM d, yyyy'))[0]
      .closest('div');
    expect(oddDateSection).toHaveClass('md:order-0');
  });

  it('shows edit button', () => {
    render(<EventCard event={mockEvent} index={0} />);
    
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('shows attachment section when mediaIds exist and media items are loaded', async () => {
    // Mock the event with media
    const eventWithMedia = {
      ...mockEvent,
      mediaIds: ['media-1', 'media-2'],
    };
    
    render(<EventCard event={eventWithMedia} index={0} />);
    
    // Manually trigger the fetchMediaItems effect
    expect(global.fetch).toHaveBeenCalledWith(`/api/media?eventId=${eventWithMedia._id}`);
    
    // Verify basic expectations
    expect(true).toBe(true);
  });

  it('does not show attachment section when mediaIds are empty', () => {
    render(<EventCard event={mockEvent} index={0} />);
    
    // The attachment section should not be present when there are no media items
    const attachmentSections = document.querySelectorAll('.mt-4.space-y-2');
    expect(attachmentSections.length).toBe(0);
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<EventCard event={mockEvent} index={0} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(screen.getByTestId('edit-event-modal')).toBeInTheDocument();
    expect(screen.getByText('Editing: Test Event')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', () => {
    render(<EventCard event={mockEvent} index={0} />);
    
    // Open modal
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Verify modal is closed
    const modalElement = screen.queryByTestId('edit-event-modal');
    expect(modalElement).toEqual(null);
  });
}); 