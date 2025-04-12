// Set environment variables for testing
process.env.MONGODB_URI = "mongodb://localhost:27017/relationship_timeline_test"
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud"
process.env.CLOUDINARY_API_KEY = "test-api-key" 
process.env.CLOUDINARY_API_SECRET = "test-api-secret"
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud"
process.env.NEXTAUTH_URL = "http://localhost:3000"
process.env.NEXTAUTH_SECRET = "supersecret"
process.env.NODE_ENV = "test"

// Configure JSDOM for React 18 using CommonJS require
const { JSDOM } = require('jsdom');

// Setup DOM environment for React 18
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};

// Import @testing-library/jest-dom using CommonJS
require('@testing-library/jest-dom');

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {}
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn()
}));

// Mock next-auth
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: "Test User", email: "test@example.com", role: "client" }
  };
  
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' };
    }),
    getSession: jest.fn(() => Promise.resolve(mockSession)),
    signIn: jest.fn(() => Promise.resolve({ error: null, status: 200, ok: true })),
    signOut: jest.fn(() => Promise.resolve(true)),
  };
});

jest.mock("next-auth", () => {
  return {
    __esModule: true,
    getServerSession: jest.fn(() => {
      return Promise.resolve({
        user: { name: "Test User", email: "test@example.com", role: "client" }
      });
    }),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Custom matchers for testing
// Extend Jest's expect with custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined && 
                 document.body.contains(received);
    return {
      pass,
      message: () => pass ? 
        `Expected element not to be in the document` :
        `Expected element to be in the document, but it was not found`,
    };
  },
  toBeVisible(received) {
    const isVisible = 
      received !== null && 
      received !== undefined && 
      document.body.contains(received) &&
      received.style.display !== 'none' && 
      received.style.visibility !== 'hidden' &&
      received.style.opacity !== '0';
    
    return {
      pass: isVisible,
      message: () => isVisible ? 
        `Expected element not to be visible, but it was` :
        `Expected element to be visible, but it was not`,
    };
  },
  toHaveClass(received, className) {
    const hasClass = received.classList.contains(className);
    
    return {
      pass: hasClass,
      message: () => hasClass ? 
        `Expected element not to have class ${className}, but it did` :
        `Expected element to have class ${className}, but it did not`,
    };
  },
  toHaveValue(received, expectedValue) {
    const value = received.value;
    const hasValue = value === expectedValue;
    
    return {
      pass: hasValue,
      message: () => hasValue ? 
        `Expected element not to have value ${expectedValue}, but it did` :
        `Expected element to have value ${expectedValue}, but it had value ${value}`,
    };
  },
  toHaveAttribute(received, attr, expectedValue) {
    const hasAttr = received.hasAttribute(attr);
    const value = received.getAttribute(attr);
    const hasExpectedValue = expectedValue === undefined || value === expectedValue;
    const pass = hasAttr && hasExpectedValue;
    
    let message;
    if (pass) {
      message = expectedValue === undefined ?
        `Expected element not to have attribute ${attr}, but it did` :
        `Expected element not to have attribute ${attr} with value ${expectedValue}, but it did`;
    } else {
      if (!hasAttr) {
        message = `Expected element to have attribute ${attr}, but it did not`;
      } else {
        message = `Expected element to have attribute ${attr} with value ${expectedValue}, but it had value ${value}`;
      }
    }
    
    return {
      pass,
      message: () => message,
    };
  }
});

// MongoDB Memory Server setup
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors for React warnings during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/i.test(args[0]) ||
    /Warning: Expected server HTML to contain a matching/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
}; 