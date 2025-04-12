// Set environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.CLOUDINARY_URL = 'cloudinary://test';

// Create a mock connect function
const mockConnect = jest.fn().mockImplementation(() => {
  return Promise.resolve({});
});

// Create mock mongoose object
const mockMongoose = {
  connect: mockConnect,
  connection: { readyState: 0 }
};

// Mock mongoose module
jest.mock('mongoose', () => mockMongoose);

// Save the original mongodb file
const originalMongodb = jest.requireActual('@/lib/mongodb');

// Mock the mongodb module to directly test error cases
jest.mock('@/lib/mongodb', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      // Check if cached connection exists
      // @ts-ignore
      if (global.mongoose && global.mongoose.conn) {
        // @ts-ignore
        return Promise.resolve(global.mongoose.conn);
      }
      
      // Check if MONGODB_URI is defined
      if (!process.env.MONGODB_URI) {
        return Promise.reject(new Error('Please define the MONGODB_URI environment variable'));
      }
      
      // Use the mocked connect function with error handling
      return mockConnect()
        .then(() => Promise.resolve(mockMongoose))
        .catch((error) => Promise.reject(error));
    })
  };
});

// Export mocks for tests
global.__mocks__ = {
  mockConnect,
  mockMongoose
};

// Suppress console errors during tests
console.error = jest.fn();

// Make sure to reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
}); 