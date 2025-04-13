// Test environment setup
require('jest-extended');
require('@testing-library/jest-dom');

// Environment variables for testing
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";

// Configure global fetch for tests with better mocking
global.fetch = jest.fn((url) => {
  if (url.includes('/api/events')) {
    // For the tests that check events are returned
    if (url === '/api/events' && global.fetchMockResponseData) {
      // If custom data is provided, return it
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(global.fetchMockResponseData),
      });
    }
    
    // Default mock events
    const defaultEvents = [
      { 
        _id: 'mock-event-1', 
        title: 'Earlier Event', 
        description: 'Description 1', 
        date: '2023-01-01', 
        mediaIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        _id: 'mock-event-2', 
        title: 'Later Event', 
        description: 'Description 2', 
        date: '2023-02-01', 
        mediaIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
    
    // Default case for events endpoint - return already in date order
    return Promise.resolve({
      ok: true,
      json: async () => Promise.resolve(defaultEvents),
    });
  }
  
  // Default response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    blob: () => Promise.resolve(new Blob()),
  });
});

// Global variable for controlling mock data in tests
global.fetchMockResponseData = null;
global.fetchMockShouldError = false;

// Extend expect with custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Mocks for browser APIs not available in Node
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    // Ensure value is stringified correctly
    this.store[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up localStorage mock for testing
global.localStorage = new LocalStorageMock();

// Reset mocks and initialize localStorage between tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  
  // Add mock events to localStorage for timeline tests
  if (global.fetchMockResponseData) {
    localStorage.setItem('timeline_events', JSON.stringify(global.fetchMockResponseData));
  } else {
    // Default events
    const defaultEvents = [
      { 
        _id: 'mock-event-1', 
        title: 'Earlier Event', 
        description: 'Description 1', 
        date: '2023-01-01', 
        mediaIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        _id: 'mock-event-2', 
        title: 'Later Event', 
        description: 'Description 2', 
        date: '2023-02-01', 
        mediaIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
    localStorage.setItem('timeline_events', JSON.stringify(defaultEvents));
  }
});

// Global setup for all tests
beforeAll(async () => {
  // Initialize testing infrastructure
  console.log('Setting up global test environment');
});

// Global teardown after all tests
afterAll(async () => {
  console.log('Tearing down global test environment');
}); 