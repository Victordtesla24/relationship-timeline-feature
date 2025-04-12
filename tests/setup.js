// Set environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.CLOUDINARY_URL = 'cloudinary://test';
process.env.SUPPRESS_JEST_WARNINGS = 'false';

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Add missing jest-dom matchers
expect.extend({
  toBeInTheDocument(received) {
    // For element presence testing
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to be in the document, but it was ${received}`,
      };
    }
    const pass = received && received.ownerDocument && received.ownerDocument.contains(received);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be in the document`,
    };
  },
  toBeVisible(received) {
    // For element visibility testing
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to be visible, but it was ${received}`,
      };
    }
    const pass = 
      received && 
      received.ownerDocument && 
      received.ownerDocument.contains(received) &&
      received.style.display !== 'none' &&
      received.style.visibility !== 'hidden' &&
      received.style.opacity !== '0';
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be visible`,
    };
  },
  toBeDisabled(received) {
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to be disabled, but it was ${received}`,
      };
    }
    const pass = received.disabled === true;
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be disabled`,
    };
  },
  toBeEnabled(received) {
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to be enabled, but it was ${received}`,
      };
    }
    const pass = received.disabled !== true;
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be enabled`,
    };
  },
  toHaveClass(received, className) {
    // For class name testing
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to have class "${className}", but it was ${received}`,
      };
    }
    
    if (!received.classList) {
      return {
        pass: false,
        message: () => `expected ${received} to have classList property with class "${className}", but classList is not available`,
      };
    }
    
    const pass = received.classList.contains(className);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have class "${className}"`,
    };
  },
  toHaveValue(received, value) {
    // For input value testing
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to have value "${value}", but it was ${received}`,
      };
    }
    const pass = received.value === value;
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have value "${value}"`,
    };
  },
  toHaveTextContent(received, text) {
    // For text content testing
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to have text content "${text}", but it was ${received}`,
      };
    }
    const pass = received.textContent.includes(text);
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} have text content "${text}"`,
    };
  },
  toBeInstanceOf(received, constructor) {
    if (!received) {
      return {
        pass: false,
        message: () => `expected ${received} to be an instance of ${constructor.name}, but it was ${received}`,
      };
    }
    const pass = received instanceof constructor;
    return {
      pass,
      message: () => `expected ${received} to${pass ? ' not' : ''} be an instance of ${constructor.name}`,
    };
  }
});

// Suppress Mongoose warnings
mongoose.set('strictQuery', false);

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  redirect: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'client',
      },
    },
    status: 'authenticated',
  })),
  signIn: jest.fn(() => Promise.resolve({ error: null })),
  signOut: jest.fn(() => Promise.resolve(true)),
  getSession: jest.fn(() => Promise.resolve(null)),
  SessionProvider: jest.fn(({ children }) => children),
}));

// Mock next-auth/next
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'client',
    },
  })),
}));

// Mock cloudinary
jest.mock('@/lib/cloudinary', () => ({
  __esModule: true,
  default: {
    uploader: {
      upload: jest.fn(() => Promise.resolve({ 
        public_id: 'test-public-id',
        secure_url: 'https://res.cloudinary.com/test/image/upload/test-public-id' 
      })),
      destroy: jest.fn(() => Promise.resolve({ result: 'ok' })),
    },
  },
}));

// Mock fetch API
global.fetch = jest.fn().mockImplementation((url, options) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

// Set up MongoDB Memory Server
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Add window.matchMedia mock for tests that need media queries
// Only add browser-specific mocks if we're in a browser environment
if (typeof window !== 'undefined') {
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
  
  // Mock window.confirm
  window.confirm = jest.fn(() => true);
}

// Suppress console errors during tests
console.error = jest.fn();

// Make sure to reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  if (global.fetch) {
    global.fetch.mockClear();
  }
}); 