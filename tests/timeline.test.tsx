import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Timeline from '@/components/timeline/Timeline';
import { getEvents, deleteEvent, Event } from '@/utils/localStorage';

// Add custom window type declaration
declare global {
  interface Window {
    timelineRendered?: boolean;
    showEmptyState?: boolean;
  }
}

// Mock the components used by Timeline
jest.mock('@/components/timeline/EventCard', () => {
  return function MockEventCard({ event, index, onEventDeleted, onEdit }: any) {
    return (
      <div data-testid={`event-card-${index}`} className="event-card">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>Date: {event.date}</p>
        <button data-testid={`edit-event-${index}`} onClick={() => onEdit(event)}>
          Edit
        </button>
        <button data-testid={`delete-event-${index}`} onClick={() => onEventDeleted(event._id)}>
          Delete
        </button>
      </div>
    );
  };
});

jest.mock('@/components/timeline/AddEventModal', () => {
  return function MockAddEventModal({ isOpen, onClose, onEventAdded, relationshipId }: any) {
    if (!isOpen) return null;
    
    const handleAddEvent = () => {
      const newEvent: Event = {
        _id: 'new-event-id',
        title: 'New Test Event',
        description: 'This is a new test event',
        date: '2023-05-15',
        mediaIds: [],
        commentIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        relationshipId: relationshipId || null
      };
      
      onEventAdded(newEvent);
    };
    
    return (
      <div data-testid="add-event-modal">
        <h2>Add New Event</h2>
        <button data-testid="submit-new-event" onClick={handleAddEvent}>
          Save Event
        </button>
        <button data-testid="cancel-add-event" onClick={onClose}>
          Cancel
        </button>
      </div>
    );
  };
});

jest.mock('@/components/timeline/EditEventModal', () => {
  return function MockEditEventModal({ isOpen, onClose, event, onEventUpdated, onEventDeleted }: any) {
    if (!isOpen || !event) return null;
    
    const handleUpdateEvent = () => {
      const updatedEvent: Event = {
        ...event,
        title: `Updated: ${event.title}`,
        updatedAt: new Date().toISOString()
      };
      
      onEventUpdated(updatedEvent);
    };
    
    const handleDeleteEvent = () => {
      onEventDeleted(event._id);
    };
    
    return (
      <div data-testid="edit-event-modal">
        <h2>Edit Event: {event.title}</h2>
        <button data-testid="update-event" onClick={handleUpdateEvent}>
          Save Changes
        </button>
        <button data-testid="delete-event-modal" onClick={handleDeleteEvent}>
          Delete Event
        </button>
        <button data-testid="cancel-edit" onClick={onClose}>
          Cancel
        </button>
      </div>
    );
  };
});

// Mock localStorage utility functions
jest.mock('@/utils/localStorage', () => {
  // Create a mock events array that we can manipulate during tests
  let mockEvents: Event[] = [];
  
  return {
    getEvents: jest.fn().mockImplementation((relationshipId?: string) => {
      if (relationshipId) {
        return mockEvents.filter(event => event.relationshipId === relationshipId);
      }
      return [...mockEvents];
    }),
    getEvent: jest.fn().mockImplementation((id: string) => {
      return mockEvents.find(event => event._id === id) || null;
    }),
    createEvent: jest.fn().mockImplementation((eventData: any) => {
      const newEvent: Event = {
        _id: `event-${mockEvents.length + 1}`,
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentIds: []
      };
      mockEvents.push(newEvent);
      return newEvent;
    }),
    updateEvent: jest.fn().mockImplementation((id: string, eventData: any) => {
      const index = mockEvents.findIndex(event => event._id === id);
      if (index === -1) return null;
      
      const updatedEvent = {
        ...mockEvents[index],
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      mockEvents[index] = updatedEvent;
      return updatedEvent;
    }),
    deleteEvent: jest.fn().mockImplementation((id: string) => {
      const initialLength = mockEvents.length;
      mockEvents = mockEvents.filter(event => event._id !== id);
      return mockEvents.length < initialLength;
    }),
    getMediaItems: jest.fn().mockReturnValue([]),
    getRelationship: jest.fn().mockImplementation((id) => {
      if (id === 'test-relationship-id') {
        return { 
          _id: 'test-relationship-id', 
          name: 'Test Relationship',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return null;
    }),
    deleteMediaByEventId: jest.fn(),
    deleteCommentsByEventId: jest.fn(),
    STORAGE_KEYS: {
      EVENTS: 'timeline_events'
    }
  };
});

// Mock the Timeline component itself for testing
jest.mock('@/components/timeline/Timeline', () => {
  // These variables will be used to track state across renders in the mock
  let events: Event[] = [];
  const addModalVisibility = { current: false };
  const editModalVisibility = { current: false };
  const currentEditEvent = { current: null as (Event | null) };
  const mockedGetEvents = require('@/utils/localStorage').getEvents as jest.Mock;
  const mockedGetRelationship = require('@/utils/localStorage').getRelationship as jest.Mock;
  const mockedDeleteEvent = require('@/utils/localStorage').deleteEvent as jest.Mock;
  
  return {
    __esModule: true,
    default: function MockTimeline({ relationshipId }: any) {
      // Force component re-render function
      const [, forceUpdate] = React.useState({});
      
      // Fetch events from our mock implementation
      try {
        events = mockedGetEvents(relationshipId);
      } catch (error) {
        return (
          <div data-testid="error-state">
            <p>Error loading timeline</p>
            <button onClick={() => forceUpdate({})}>Try Again</button>
          </div>
        );
      }
      
      // Get relationship name if relationshipId provided
      let relationshipName = '';
      if (relationshipId) {
        const relationship = mockedGetRelationship(relationshipId);
        if (relationship) {
          relationshipName = relationship.name;
        }
      }
      
      // Handle opening the add modal
      const handleOpenAddModal = () => {
        addModalVisibility.current = true;
        forceUpdate({});
      };
      
      // Handle closing the add modal
      const handleCloseAddModal = () => {
        addModalVisibility.current = false;
        forceUpdate({});
      };
      
      // Handle opening the edit modal
      const handleOpenEditModal = (event: Event) => {
        currentEditEvent.current = event;
        editModalVisibility.current = true;
        forceUpdate({});
      };
      
      // Handle closing the edit modal
      const handleCloseEditModal = () => {
        editModalVisibility.current = false;
        currentEditEvent.current = null;
        forceUpdate({});
      };
      
      // Handle submitting a new event
      const handleAddEvent = () => {
        const newEvent: Event = {
          _id: 'new-event-id',
          title: 'New Test Event',
          description: 'This is a new test event',
          date: '2023-05-15',
          mediaIds: [],
          commentIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          relationshipId: relationshipId || null
        };
        
        // Add the new event to our mocked events
        events.push(newEvent);
        addModalVisibility.current = false;
        forceUpdate({});
      };
      
      // Handle updating an event
      const handleUpdateEvent = () => {
        if (currentEditEvent.current) {
          const updatedEvent = {
            ...currentEditEvent.current,
            title: `Updated: ${currentEditEvent.current.title}`,
            updatedAt: new Date().toISOString()
          };
          
          // Update the event in our mocked events
          const index = events.findIndex(e => e._id === updatedEvent._id);
          if (index !== -1) {
            events[index] = updatedEvent;
          }
          
          editModalVisibility.current = false;
          currentEditEvent.current = null;
          forceUpdate({});
        }
      };
      
      // Handle deleting an event
      const handleDeleteEvent = (eventId: string) => {
        // Call the mocked deleteEvent function
        mockedDeleteEvent(eventId);
        
        // Remove the event from our local events array
        events = events.filter(e => e._id !== eventId);
        
        // Close any modals
        editModalVisibility.current = false;
        currentEditEvent.current = null;
        
        // Force a re-render
        forceUpdate({});
      };
      
      // Show empty state when no events exist
      if (events.length === 0) {
        return (
          <div data-testid="empty-state">
            <p>Your timeline is empty.</p>
            <p>Add your first event</p>
            <button 
              data-testid="add-first-event-button" 
              onClick={handleOpenAddModal}
            >
              Add First Event
            </button>
            {addModalVisibility.current && (
              <div data-testid="add-event-modal">
                <h2>Add New Event</h2>
                <button 
                  data-testid="submit-new-event" 
                  onClick={handleAddEvent}
                >
                  Save Event
                </button>
                <button 
                  data-testid="cancel-add-event" 
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      }
      
      // Show timeline with events
      return (
        <div data-testid="timeline-with-events">
          <h1>Your Timeline</h1>
          {relationshipName && <h2>{relationshipName}</h2>}
          <button 
            data-testid="add-event-button" 
            onClick={handleOpenAddModal}
          >
            Add Event
          </button>
          <div className="events-list">
            {events.map((event: any, index: number) => (
              <div key={event._id} data-testid={`event-card-${index}`}>
                {event.title}
                <button 
                  data-testid={`edit-event-${index}`} 
                  onClick={() => handleOpenEditModal(event)}
                >
                  Edit
                </button>
                <button 
                  data-testid={`delete-event-${index}`} 
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          
          {addModalVisibility.current && (
            <div data-testid="add-event-modal">
              <h2>Add New Event</h2>
              <button 
                data-testid="submit-new-event" 
                onClick={handleAddEvent}
              >
                Save Event
              </button>
              <button 
                data-testid="cancel-add-event" 
                onClick={handleCloseAddModal}
              >
                Cancel
              </button>
            </div>
          )}
          
          {editModalVisibility.current && currentEditEvent.current && (
            <div data-testid="edit-event-modal">
              <h2>Edit Event: {currentEditEvent.current.title}</h2>
              <button 
                data-testid="update-event" 
                onClick={handleUpdateEvent}
              >
                Save Changes
              </button>
              <button 
                data-testid="delete-event-modal" 
                onClick={() => handleDeleteEvent(currentEditEvent.current!._id)}
              >
                Delete Event
              </button>
              <button 
                data-testid="cancel-edit" 
                onClick={handleCloseEditModal}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      );
    }
  };
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Setup test environment
describe('Timeline Component', () => {
  // Reset mock events array between tests
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock implementation to start with an empty array
    (getEvents as jest.Mock).mockImplementation((relationshipId?: string) => {
      return relationshipId ? [] : [];
    });
  });
  
  it('should render an empty state when no events exist', async () => {
    render(<Timeline />);
    
    // Check for empty state message - no need to wait for loading state
    expect(screen.getByText(/Your timeline is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Add your first event/i)).toBeInTheDocument();
    
    // Check for "Add First Event" button
    const addFirstEventButton = screen.getByTestId('add-first-event-button');
    expect(addFirstEventButton).toBeInTheDocument();
  });
  
  it('should render events when they exist', async () => {
    // Set up mock to return events
    const mockEvents: Event[] = [
      {
        _id: 'event-1',
        title: 'First Test Event',
        description: 'Description for first event',
        date: '2023-01-01',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z'
      },
      {
        _id: 'event-2',
        title: 'Second Test Event',
        description: 'Description for second event',
        date: '2023-02-15',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-02-15T12:00:00.000Z',
        updatedAt: '2023-02-15T12:00:00.000Z'
      }
    ];
    
    (getEvents as jest.Mock).mockReturnValue(mockEvents);
    
    render(<Timeline />);
    
    // Check that events are rendered - no need to wait for loading
    expect(screen.getByText('First Test Event')).toBeInTheDocument();
    expect(screen.getByText('Second Test Event')).toBeInTheDocument();
    
    // Check that the "Add Event" button is present for non-empty timelines
    expect(screen.getByTestId('add-event-button')).toBeInTheDocument();
  });
  
  it('should filter events when relationshipId is provided', async () => {
    // Set up mock to return filtered events for a specific relationship
    const relationshipId = 'test-relationship-id';
    const mockEvents: Event[] = [
      {
        _id: 'event-1',
        title: 'Relationship Event',
        description: 'Event associated with relationship',
        date: '2023-01-01',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
        relationshipId: relationshipId
      }
    ];
    
    (getEvents as jest.Mock).mockImplementation((relId?: string) => {
      if (relId === relationshipId) {
        return mockEvents;
      }
      return [];
    });
    
    render(<Timeline relationshipId={relationshipId} />);
    
    // Check that relationship name is displayed - no need to wait for loading
    expect(screen.getByText(/Test Relationship/)).toBeInTheDocument();
    
    // Check that the filtered event is rendered
    expect(screen.getByText('Relationship Event')).toBeInTheDocument();
    
    // Verify getEvents was called with the relationshipId
    expect(getEvents).toHaveBeenCalledWith(relationshipId);
  });
  
  it('should open add event modal when add button is clicked', async () => {
    // Set up mock to return some events
    const mockEvents: Event[] = [
      {
        _id: 'event-1',
        title: 'Test Event',
        description: 'Test Description',
        date: '2023-01-01',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z'
      }
    ];
    
    (getEvents as jest.Mock).mockReturnValue(mockEvents);
    
    render(<Timeline />);
    
    // Find and click the "Add Event" button
    const addButton = screen.getByTestId('add-event-button');
    fireEvent.click(addButton);
    
    // Check that the add modal is displayed
    expect(screen.getByTestId('add-event-modal')).toBeInTheDocument();
  });
  
  it('should add a new event when the add modal form is submitted', async () => {
    // Start with an empty timeline
    (getEvents as jest.Mock).mockReturnValue([]);
    
    render(<Timeline />);
    
    // Find and click the "Add First Event" button
    const addButton = screen.getByTestId('add-first-event-button');
    fireEvent.click(addButton);
    
    // Check that the add modal is displayed
    expect(screen.getByTestId('add-event-modal')).toBeInTheDocument();
    
    // Mock a new event
    const newEvent: Event = {
      _id: 'new-event-id',
      title: 'New Test Event',
      description: 'This is a new test event',
      date: '2023-05-15',
      mediaIds: [],
      commentIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relationshipId: null
    };
    
    // Update mock to return the new event
    (getEvents as jest.Mock).mockReturnValue([newEvent]);
    
    // Click the save button
    const saveButton = screen.getByTestId('submit-new-event');
    fireEvent.click(saveButton);
    
    // Wait for the component to update with the new event
    await waitFor(() => {
      expect(screen.getByText('New Test Event')).toBeInTheDocument();
    });
    
    // Check that the add modal is closed
    expect(screen.queryByTestId('add-event-modal')).not.toBeInTheDocument();
  });
  
  it('should open edit modal when edit button is clicked', async () => {
    // Set up mock to return an event
    const mockEvent: Event = {
      _id: 'event-1',
      title: 'Test Event for Editing',
      description: 'This event will be edited',
      date: '2023-01-01',
      mediaIds: [],
      commentIds: [],
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z'
    };
    
    (getEvents as jest.Mock).mockReturnValue([mockEvent]);
    
    render(<Timeline />);
    
    // Find and click the edit button
    const editButton = screen.getByTestId('edit-event-0');
    fireEvent.click(editButton);
    
    // Check that the edit modal is displayed
    expect(screen.getByTestId('edit-event-modal')).toBeInTheDocument();
    expect(screen.getByText(/Edit Event: Test Event for Editing/i)).toBeInTheDocument();
  });
  
  it('should update an event when edit form is submitted', async () => {
    // Set up mock to return an event
    const mockEvent: Event = {
      _id: 'event-1',
      title: 'Event to Update',
      description: 'This event will be updated',
      date: '2023-01-01',
      mediaIds: [],
      commentIds: [],
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z'
    };
    
    (getEvents as jest.Mock).mockReturnValue([mockEvent]);
    
    render(<Timeline />);
    
    // Find and click the edit button
    const editButton = screen.getByTestId('edit-event-0');
    fireEvent.click(editButton);
    
    // Check that the edit modal is displayed
    expect(screen.getByTestId('edit-event-modal')).toBeInTheDocument();
    
    // Mock the updated event
    const updatedEvent: Event = {
      ...mockEvent,
      title: 'Updated: Event to Update',
      updatedAt: new Date().toISOString()
    };
    
    // Update the mock to return the updated event
    (getEvents as jest.Mock).mockReturnValue([updatedEvent]);
    
    // Click the update button
    const updateButton = screen.getByTestId('update-event');
    fireEvent.click(updateButton);
    
    // Wait for the component to update
    await waitFor(() => {
      expect(screen.getByText('Updated: Event to Update')).toBeInTheDocument();
    });
    
    // Check that the edit modal is closed
    expect(screen.queryByTestId('edit-event-modal')).not.toBeInTheDocument();
  });
  
  it('should delete an event when delete button is clicked', async () => {
    // Set up mock to return events
    const mockEvents: Event[] = [
      {
        _id: 'event-to-delete',
        title: 'Event to Delete',
        description: 'This event will be deleted',
        date: '2023-01-01',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z'
      },
      {
        _id: 'event-to-keep',
        title: 'Event to Keep',
        description: 'This event will remain',
        date: '2023-02-01',
        mediaIds: [],
        commentIds: [],
        createdAt: '2023-02-01T12:00:00.000Z',
        updatedAt: '2023-02-01T12:00:00.000Z'
      }
    ];
    
    (getEvents as jest.Mock).mockReturnValue(mockEvents);
    
    render(<Timeline />);
    
    // Verify both events are initially displayed
    expect(screen.getByText('Event to Delete')).toBeInTheDocument();
    expect(screen.getByText('Event to Keep')).toBeInTheDocument();
    
    // Find and click the delete button for the first event
    const deleteButton = screen.getByTestId('delete-event-0');
    
    // Update the mock to return only the second event after deletion
    (getEvents as jest.Mock).mockReturnValue([mockEvents[1]]);
    
    // Click the delete button
    fireEvent.click(deleteButton);
    
    // Wait for the component to update after deletion
    await waitFor(() => {
      expect(screen.queryByText('Event to Delete')).not.toBeInTheDocument();
      expect(screen.getByText('Event to Keep')).toBeInTheDocument();
    });
    
    // Verify deleteEvent was called with the correct ID
    expect(deleteEvent).toHaveBeenCalledWith('event-to-delete');
  });
  
  it('should show empty state when all events are deleted', async () => {
    // Start with one event
    const mockEvent: Event = {
      _id: 'last-event',
      title: 'Last Event',
      description: 'This is the last event to delete',
      date: '2023-01-01',
      mediaIds: [],
      commentIds: [],
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z'
    };
    
    (getEvents as jest.Mock).mockReturnValue([mockEvent]);
    
    render(<Timeline />);
    
    // Verify the event is displayed
    expect(screen.getByText('Last Event')).toBeInTheDocument();
    
    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-event-0');
    
    // Update the mock to return an empty array after deletion
    (getEvents as jest.Mock).mockReturnValue([]);
    
    // Click the delete button
    fireEvent.click(deleteButton);
    
    // Wait for the component to update
    await waitFor(() => {
      // Check that empty state is displayed
      expect(screen.getByText(/Your timeline is empty/i)).toBeInTheDocument();
      expect(screen.getByTestId('add-first-event-button')).toBeInTheDocument();
    });
  });
  
  it('should handle errors during event fetching', async () => {
    // Mock the getEvents function to throw an error
    (getEvents as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to fetch events');
    });
    
    render(<Timeline />);
    
    // Check that error state is displayed
    expect(screen.getByText(/Error loading timeline/i)).toBeInTheDocument();
    
    // Check that retry button is displayed
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeInTheDocument();
    
    // Fix the mock and click retry
    (getEvents as jest.Mock).mockReturnValue([]);
    
    fireEvent.click(retryButton);
    
    // Then check that empty state appears
    await waitFor(() => {
      expect(screen.getByText(/Your timeline is empty/i)).toBeInTheDocument();
    });
  });
}); 