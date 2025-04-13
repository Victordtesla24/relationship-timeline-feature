import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Timeline from '@/components/timeline/Timeline';

// Mock fetch API for events
global.fetch = jest.fn();

describe('Timeline Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<Timeline />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no events are returned', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      expect(screen.getByText('Your timeline is empty')).toBeInTheDocument();
    });
  });

  it('renders events when they are returned from API', async () => {
    const mockEvents = [
      { _id: '1', title: 'Event 1', description: 'Description 1', date: '2023-01-01', mediaIds: [] },
      { _id: '2', title: 'Event 2', description: 'Description 2', date: '2023-02-01', mediaIds: [] },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      expect(screen.getByTestId('event-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error loading timeline/)).toBeInTheDocument();
    });
  });

  it('opens add event modal when button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      expect(screen.getByText('Add Your First Event')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Add Your First Event'));
    
    expect(screen.getByTestId('add-event-modal')).toBeInTheDocument();
  });

  it('adds a new event when created from modal', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      expect(screen.getByText('Add Your First Event')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Add Your First Event'));
    fireEvent.click(screen.getByTestId('add-event'));
    
    await waitFor(() => {
      expect(screen.getByTestId('event-card-0')).toBeInTheDocument();
      expect(screen.getByText('New Event')).toBeInTheDocument();
    });
  });

  it('sorts events by date', async () => {
    // Events purposely out of date order
    const mockEvents = [
      { _id: '2', title: 'Later Event', description: 'Description 2', date: '2023-02-01', mediaIds: [] },
      { _id: '1', title: 'Earlier Event', description: 'Description 1', date: '2023-01-01', mediaIds: [] },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });
    
    render(<Timeline />);
    
    await waitFor(() => {
      const cards = screen.getAllByTestId(/^event-card-\d+$/);
      expect(cards[0]).toHaveTextContent('Earlier Event');
      expect(cards[1]).toHaveTextContent('Later Event');
    });
  });
}); 