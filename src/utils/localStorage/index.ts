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

// Define localStorage keys per requirements
export const STORAGE_KEYS = {
  TIMELINE: 'relationship_timeline',
  EVENTS: 'timeline_events',
  MEDIA: 'timeline_media',
  COMMENTS: 'timeline_comments'
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
export const getEvents = (): Event[] => {
  return getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
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
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  const newEvents = events.filter(event => event._id !== id);
  
  if (newEvents.length === events.length) return false;
  
  setLocalStorage(STORAGE_KEYS.EVENTS, newEvents);
  
  // Also delete all media and comments associated with this event
  deleteMediaByEventId(id);
  deleteCommentsByEventId(id);
  
  return true;
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
  
  media.push(newMedia);
  setLocalStorage(STORAGE_KEYS.MEDIA, media);
  return newMedia;
};

export const deleteMedia = (id: string): boolean => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  const newMedia = media.filter(item => item._id !== id);
  
  if (newMedia.length === media.length) return false;
  
  setLocalStorage(STORAGE_KEYS.MEDIA, newMedia);
  return true;
};

export const deleteMediaByEventId = (eventId: string): void => {
  const media = getLocalStorage<Media>(STORAGE_KEYS.MEDIA);
  const newMedia = media.filter(item => item.eventId !== eventId);
  setLocalStorage(STORAGE_KEYS.MEDIA, newMedia);
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

// Seed initial data if needed
export const seedInitialData = (): void => {
  if (!isClient) return;
  
  // Only seed if no data exists
  const events = getLocalStorage<Event>(STORAGE_KEYS.EVENTS);
  
  if (events.length === 0) {
    // Sample events
    const event1: Event = {
      _id: uuidv4(),
      title: 'First Meeting',
      description: 'Our first meeting at the coffee shop',
      date: '2023-01-15',
      mediaIds: [],
      commentIds: [],
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setLocalStorage(STORAGE_KEYS.EVENTS, [event1, event2]);
  }
}; 