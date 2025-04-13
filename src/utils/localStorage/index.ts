import { v4 as uuidv4 } from 'uuid';

// Define types for local storage
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  mediaIds: string[];
  commentIds?: string[];
  createdAt: string;
  updatedAt: string;
  relationshipId?: string | null;
}

export interface Media {
  _id: string;
  name: string;
  url: string;
  type: string;
  eventId: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  eventId: string;
  createdAt: string;
}

// New Relationship interface
export interface Relationship {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Define localStorage keys per requirements
export const STORAGE_KEYS = {
  TIMELINE: 'relationship_timeline',
  EVENTS: 'timeline_events',
  MEDIA: 'timeline_media',
  COMMENTS: 'timeline_comments',
  RELATIONSHIPS: 'timeline_relationships'
};

// Check if localStorage is available (client-side)
const isClient = typeof window !== 'undefined';

// Helper functions for local storage
export const getLocalStorage = <T>(key: string): T[] => {
  if (!isClient) return [];
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

export const setLocalStorage = <T>(key: string, data: T[]): void => {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Event functions
export const getEvents = (relationshipId?: string): Event[] => {
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  if (relationshipId) {
    return events.filter(event => event.relationshipId === relationshipId);
  }
  return events;
};

export const getEvent = (id: string): Event | null => {
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  return events.find(event => event._id === id) || null;
};

export const createEvent = (eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>): Event => {
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const now = new Date().toISOString();
  
  const newEvent: Event = {
    _id: uuidv4(),
    ...eventData,
    createdAt: now,
    updatedAt: now
  };
  
  events.push(newEvent);
  setLocalStorage(STORAGE_KEYS.EVENTS, events);
  return newEvent;
};

export const updateEvent = (id: string, eventData: Partial<Event>): Event | null => {
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const index = events.findIndex(event => event._id === id);
  
  if (index === -1) return null;
  
  const updatedEvent = {
    ...events[index],
    ...eventData,
    updatedAt: new Date().toISOString()
  };
  
  events[index] = updatedEvent;
  setLocalStorage(STORAGE_KEYS.EVENTS, events);
  return updatedEvent;
};

export const deleteEvent = (id: string): boolean => {
  try {
    // Step 1: Get current events and validate input
    if (!id) {
      console.error('Delete event failed: Invalid event ID');
      return false;
    }
    
    const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
    
    // Verify the event exists
    const eventToDelete = events.find(event => event._id === id);
    if (!eventToDelete) {
      console.error(`Delete event failed: Event with ID ${id} not found`);
      return false;
    }
    
    // Step 2: Filter out the event to delete
    const newEvents = events.filter(event => event._id !== id);
    
    // Extra validation that something was removed
    if (newEvents.length === events.length) {
      console.error(`Delete event failed: No events were removed for ID ${id}`);
      return false;
    }
    
    // Step 3: Save the updated events list
    setLocalStorage(STORAGE_KEYS.EVENTS, newEvents);
    
    // Step 4: Clean up related data (media and comments)
    try {
      deleteMediaByEventId(id);
    } catch (mediaError) {
      console.error('Error deleting media items:', mediaError);
      // Continue with deletion even if media cleanup fails
    }
    
    try {
      deleteCommentsByEventId(id);
    } catch (commentsError) {
      console.error('Error deleting comments:', commentsError);
      // Continue with deletion even if comments cleanup fails
    }
    
    console.log(`Event ${id} successfully deleted`);
    return true;
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return false;
  }
};

// Media functions
export const getMediaItems = (eventId?: string): Media[] => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  if (eventId) {
    return media.filter(item => item.eventId === eventId);
  }
  return media;
};

export const getMedia = (id: string): Media | null => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  return media.find(item => item._id === id) || null;
};

export const createMedia = (mediaData: Omit<Media, '_id' | 'createdAt'>): Media => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  const now = new Date().toISOString();
  
  const newMedia: Media = {
    _id: uuidv4(),
    ...mediaData,
    createdAt: now
  };
  
  // Add the media item to storage
  media.push(newMedia);
  setLocalStorage(STORAGE_KEYS.MEDIA, media);
  
  // Also update the event's mediaIds array to include this new media
  if (mediaData.eventId) {
    const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
    const eventIndex = events.findIndex(event => event._id === mediaData.eventId);
    
    if (eventIndex !== -1) {
      // Make sure mediaIds array exists
      if (!events[eventIndex].mediaIds) {
        events[eventIndex].mediaIds = [];
      }
      
      // Add the new media ID to the event's mediaIds array
      events[eventIndex].mediaIds.push(newMedia._id);
      events[eventIndex].updatedAt = now;
      
      // Save the updated events back to localStorage
      setLocalStorage(STORAGE_KEYS.EVENTS, events);
      console.log(`Added media ${newMedia._id} to event ${mediaData.eventId}'s mediaIds`);
    }
  }
  
  return newMedia;
};

export const deleteMedia = (id: string): boolean => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  // Find the media item before we delete it to get its eventId
  const mediaToDelete = media.find(item => item._id === id);
  const newMedia = media.filter(item => item._id !== id);
  
  if (newMedia.length === media.length) return false;
  
  // Save the updated media items
  setLocalStorage(STORAGE_KEYS.MEDIA, newMedia);
  
  // If we found the media item and it has an eventId,
  // remove the media ID from the event's mediaIds array
  if (mediaToDelete && mediaToDelete.eventId) {
    const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
    const eventIndex = events.findIndex(event => event._id === mediaToDelete.eventId);
    
    if (eventIndex !== -1 && events[eventIndex].mediaIds) {
      // Remove the media ID from the event's mediaIds array
      events[eventIndex].mediaIds = events[eventIndex].mediaIds.filter(
        mediaId => mediaId !== id
      );
      events[eventIndex].updatedAt = new Date().toISOString();
      
      // Save the updated events back to localStorage
      setLocalStorage(STORAGE_KEYS.EVENTS, events);
      console.log(`Removed media ${id} from event ${mediaToDelete.eventId}'s mediaIds`);
    }
  }
  
  return true;
};

export const deleteMediaByEventId = (eventId: string): void => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  
  // Find media items being deleted to log them
  const mediaBeingDeleted = media.filter(item => item.eventId === eventId);
  if (mediaBeingDeleted.length > 0) {
    console.log(`Deleting ${mediaBeingDeleted.length} media items for event ${eventId}`);
  }
  
  // Filter out media items for this event
  const newMedia = media.filter(item => item.eventId !== eventId);
  setLocalStorage(STORAGE_KEYS.MEDIA, newMedia);
  
  // Also clear the mediaIds array for this event
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const eventIndex = events.findIndex(event => event._id === eventId);
  
  if (eventIndex !== -1) {
    // Clear the mediaIds array
    events[eventIndex].mediaIds = [];
    events[eventIndex].updatedAt = new Date().toISOString();
    
    // Save the updated events back to localStorage
    setLocalStorage(STORAGE_KEYS.EVENTS, events);
    console.log(`Cleared mediaIds for event ${eventId}`);
  }
};

// Comment functions
export const getComments = (eventId?: string): Comment[] => {
  const comments = getLocalStorage<Comment>(STORAGE_KEYS.COMMENTS);
  if (eventId) {
    return comments.filter(comment => comment.eventId === eventId);
  }
  return comments;
};

export const getComment = (id: string): Comment | null => {
  const comments = getLocalStorage<Comment>(STORAGE_KEYS.COMMENTS);
  return comments.find(comment => comment._id === id) || null;
};

export const createComment = (commentData: Omit<Comment, '_id' | 'createdAt'>): Comment => {
  const comments = getLocalStorage<Comment>(STORAGE_KEYS.COMMENTS);
  const now = new Date().toISOString();
  
  const newComment: Comment = {
    _id: uuidv4(),
    ...commentData,
    createdAt: now
  };
  
  comments.push(newComment);
  setLocalStorage(STORAGE_KEYS.COMMENTS, comments);
  return newComment;
};

export const deleteComment = (id: string): boolean => {
  const comments = getLocalStorage<Comment>(STORAGE_KEYS.COMMENTS);
  const newComments = comments.filter(comment => comment._id !== id);
  
  if (newComments.length === comments.length) return false;
  
  setLocalStorage(STORAGE_KEYS.COMMENTS, newComments);
  return true;
};

export const deleteCommentsByEventId = (eventId: string): void => {
  const comments = getLocalStorage<Comment>(STORAGE_KEYS.COMMENTS);
  const newComments = comments.filter(comment => comment.eventId !== eventId);
  setLocalStorage(STORAGE_KEYS.COMMENTS, newComments);
};

// Relationship functions
export const getRelationships = (): Relationship[] => {
  return getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
};

export const getRelationship = (id: string): Relationship | null => {
  const relationships = getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
  return relationships.find(relationship => relationship._id === id) || null;
};

export const createRelationship = (relationshipData: Omit<Relationship, '_id' | 'createdAt' | 'updatedAt'>): Relationship => {
  const relationships = getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
  const now = new Date().toISOString();
  
  const newRelationship: Relationship = {
    _id: uuidv4(),
    ...relationshipData,
    createdAt: now,
    updatedAt: now
  };
  
  relationships.push(newRelationship);
  setLocalStorage(STORAGE_KEYS.RELATIONSHIPS, relationships);
  return newRelationship;
};

export const updateRelationship = (id: string, relationshipData: Partial<Relationship>): Relationship | null => {
  const relationships = getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
  const index = relationships.findIndex(relationship => relationship._id === id);
  
  if (index === -1) return null;
  
  const updatedRelationship = {
    ...relationships[index],
    ...relationshipData,
    updatedAt: new Date().toISOString()
  };
  
  relationships[index] = updatedRelationship;
  setLocalStorage(STORAGE_KEYS.RELATIONSHIPS, relationships);
  return updatedRelationship;
};

export const deleteRelationship = (id: string): boolean => {
  const relationships = getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
  const newRelationships = relationships.filter(relationship => relationship._id !== id);
  
  if (newRelationships.length === relationships.length) return false;
  
  setLocalStorage(STORAGE_KEYS.RELATIONSHIPS, newRelationships);
  
  // Update events related to this relationship
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const updatedEvents = events.map(event => {
    if (event.relationshipId === id) {
      return {
        ...event,
        relationshipId: null,
        updatedAt: new Date().toISOString()
      };
    }
    return event;
  });
  
  setLocalStorage(STORAGE_KEYS.EVENTS, updatedEvents);
  
  return true;
};

// Seed initial data if needed
export const seedInitialData = (): void => {
  if (!isClient) return;
  
  // Only seed if no data exists
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const relationships = getLocalStorage<Relationship>(STORAGE_KEYS.RELATIONSHIPS);
  
  if (events.length === 0) {
    // Sample relationships
    if (relationships.length === 0) {
      const relationship1: Relationship = {
        _id: uuidv4(),
        name: 'Sample Relationship',
        description: 'A sample relationship for demonstration',
        startDate: '2023-01-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setLocalStorage(STORAGE_KEYS.RELATIONSHIPS, [relationship1]);
      
      // Sample events
      const event1: Event = {
        _id: uuidv4(),
        title: 'First Meeting',
        description: 'Our first meeting at the coffee shop',
        date: '2023-01-15',
        mediaIds: [],
        commentIds: [],
        relationshipId: relationship1._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const event2: Event = {
        _id: uuidv4(),
        title: 'First Date',
        description: 'Our first official date at the restaurant',
        date: '2023-02-01',
        mediaIds: [],
        commentIds: [],
        relationshipId: relationship1._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setLocalStorage(STORAGE_KEYS.EVENTS, [event1, event2]);
    }
  }
}; 