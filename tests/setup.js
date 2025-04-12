// Set environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud-name';
process.env.CLOUDINARY_API_KEY = 'test-api-key';
process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';

// Import necessary modules
const { TextEncoder, TextDecoder } = require('util');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Import and configure Jest DOM matchers
require('@testing-library/jest-dom');

// Create DOM environment for React 18
const JSDOM = require('jsdom').JSDOM;
const jsdom = new JSDOM('<!doctype html><html lang="en"><body></body></html>', {
  url: 'http://localhost:3000',
  resources: 'usable',
  runScripts: 'dangerously'
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = jsdom.window.navigator;
global.React = require('react');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Copy window properties to global
Object.keys(jsdom.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = jsdom.window[property];
  }
});

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    blob: () => Promise.resolve(new Blob()),
  })
);

// Mock window.matchMedia for responsive tests
if (typeof window !== 'undefined') {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

// Add URL object with mock functions
global.URL = {
  createObjectURL: jest.fn(() => 'mock-blob-url'),
  revokeObjectURL: jest.fn(),
};

// Setup MongoDB Memory Server
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

// Extend Jest with custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(received && received.nodeType === Node.ELEMENT_NODE);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be in the document`,
    };
  },
  toHaveTextContent(received, expected) {
    const content = received ? received.textContent : '';
    const pass = content.includes(expected);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have text content "${expected}"`,
    };
  },
  toHaveClass(received, expected) {
    const classes = received ? received.className.split(' ') : [];
    const pass = classes.includes(expected);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have class "${expected}"`,
    };
  },
  toHaveValue(received, expected) {
    const value = received ? received.value : '';
    const pass = value === expected;
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have value "${expected}"`,
    };
  },
  toBeVisible(received) {
    const isVisible = received && 
                    window.getComputedStyle(received).display !== 'none' && 
                    window.getComputedStyle(received).visibility !== 'hidden' && 
                    received.offsetWidth > 0 && 
                    received.offsetHeight > 0;
    const pass = Boolean(isVisible);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be visible`,
    };
  },
  toHaveAttribute(received, name, expected) {
    if (!received || !received.hasAttribute) {
      return {
        pass: false,
        message: () => `expected ${received} to have attribute "${name}"`,
      };
    }

    const hasAttribute = received.hasAttribute(name);
    
    if (expected === undefined) {
      return {
        pass: hasAttribute,
        message: () => `expected ${received} to${hasAttribute ? ' not' : ''} have attribute "${name}"`,
      };
    }
    
    const actualValue = received.getAttribute(name);
    const pass = hasAttribute && actualValue === expected;
    
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have attribute "${name}" with value "${expected}"`,
    };
  }
});

// Clear all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors during tests (for React warnings)
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/i.test(args[0]) ||
    /Warning: React.createFactory/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
}; 