import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddEventModal from '@/components/timeline/AddEventModal';

// Mock fetch API
global.fetch = jest.fn();

describe('AddEventModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnEventAdded = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the modal when isOpen is true', () => {
    render(
      <AddEventModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onEventAdded={mockOnEventAdded} 
      />
    );
    
    expect(screen.getByText('Add New Event')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(
      <AddEventModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onEventAdded={mockOnEventAdded} 
      />
    );
    
    // Use queryByText which returns null when element doesn't exist
    const modalTitle = screen.queryByText('Add New Event');
    expect(modalTitle).toEqual(null);
  });
  
  it('calls onClose when cancel button is clicked', () => {
    render(
      <AddEventModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onEventAdded={mockOnEventAdded} 
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('submits the form with correct data', async () => {
    const mockResponse = {
      _id: 'new-event-id',
      title: 'Test Event',
      description: 'Test Description',
      date: '2023-01-01',
      mediaIds: []
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    render(
      <AddEventModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onEventAdded={mockOnEventAdded} 
      />
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Event'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events', expect.any(Object));
      expect(mockOnEventAdded).toHaveBeenCalledWith(mockResponse);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
  
  it('displays error message when API fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'API Error' }),
    });
    
    render(
      <AddEventModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onEventAdded={mockOnEventAdded} 
      />
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Event'));
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
      expect(mockOnEventAdded).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
}); 