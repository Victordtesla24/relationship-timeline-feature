const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Transform more node_modules that use ESM
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm/)?(jose|openid-client|uuid|nanoid|react-dnd-html5-backend|next-auth|@next-auth|superjson|date-fns|@date-io))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/tests/setupGlobals.js'],
  testEnvironmentOptions: {
    SUPPRESS_JEST_WARNINGS: false,
    url: 'http://localhost/'
  },
  // Include this to suppress mongoose warnings
  globals: {
    SUPPRESS_JEST_WARNINGS: false
  }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 