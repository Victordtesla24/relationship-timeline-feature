// Test environment setup
require('jest-extended');
require('@testing-library/jest-dom');

// Environment variables for testing
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";

// Configure global fetch for tests
global.fetch = require('node-fetch');

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
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up localStorage mock for testing
global.localStorage = new LocalStorageMock();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
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