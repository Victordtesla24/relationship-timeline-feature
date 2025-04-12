const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Configuration specific for MongoDB tests
const mongoJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testRegex: 'tests/lib/mongodb.test.ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(mongoJestConfig); 