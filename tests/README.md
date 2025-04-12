# Relationship Timeline App Test Suite

This directory contains comprehensive tests for the Relationship Timeline application. The tests are organized to validate that the implementation meets the requirements specified in the requirements document.

## Test Structure

The test suite is organized into the following directories:

- `auth/`: Tests for authentication functionality (login, registration, session management)
- `api/`: Tests for API endpoints (events, users, media, comments)
- `components/`: Tests for React components
- `lib/`: Tests for utility functions and libraries
- `features/`: Integration tests for complete features

## Running Tests

To run all tests:

```bash
npm test
```

To run tests with watch mode:

```bash
npm run test:watch
```

To run tests for a specific directory:

```bash
npm test -- tests/api
```

## Test Coverage

The test suite aims to cover:

1. **Authentication System**
   - User login/logout
   - Role-based access control
   - Session management

2. **Timeline Management**
   - Event creation, updates, and deletion
   - Timeline data retrieval
   - Date handling

3. **Media Handling**
   - File uploads and storage
   - Media association with events
   - Media retrieval and display

4. **Collaboration Features**
   - Role-based permissions
   - Comment addition and retrieval
   - Q&A functionality

5. **Export Features**
   - PDF generation
   - Word document generation

## Testing Approach

The tests utilize:
- Jest as the test runner
- React Testing Library for component testing
- MockedDB for MongoDB testing
- Test API Handler for API route testing
- Jest mocks for external services like Cloudinary

## Test Data

Test fixtures are located in the `__fixtures__` directory and include sample:
- Users (clients and lawyers)
- Events
- Media records
- Comments

Each test should clean up after itself to ensure isolation between tests.

## Test Structure

The test suite is organized into several categories:

- **Authentication Tests** - Test login, registration, and session management
- **API Tests** - Test API endpoints for events, users, and other resources
- **Component Tests** - Test individual UI components
- **Feature Tests** - Test complete features with multiple components working together
- **Database Tests** - Test database connection and operations

### Directory Structure

```
tests/
  ├── setup.js                # Test setup and global mocks
  ├── auth/                   # Authentication tests
  ├── api/                    # API endpoint tests
  ├── components/             # Component tests
  ├── features/               # Feature integration tests
  └── lib/                    # Library and utility tests
```

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (re-run when files change):

```bash
npm run test:watch
```

To run a specific test file:

```bash
npm test -- tests/components/timeline.test.tsx
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

## Testing Libraries and Tools

This test suite uses the following testing libraries:

- **Jest** - Test runner and assertion library
- **Testing Library** - DOM testing utilities
- **next-test-api-route-handler** - Test Next.js API routes
- **mongodb-memory-server** - In-memory MongoDB server for testing

## Writing Tests

When adding new tests, follow these guidelines:

1. **Isolation** - Each test should be independent of others
2. **Mocking** - Mock external dependencies appropriately
3. **Coverage** - Aim to cover all code paths and edge cases
4. **Assertions** - Make specific assertions about expected behavior
5. **Structure** - Follow the existing directory structure

## Testing Role-Based Access Control

The application has two primary roles: `client` and `lawyer`. Tests should verify that:

- Clients can only access their own timeline
- Lawyers can access their clients' timelines
- Specific features are visible/hidden based on role
- API endpoints enforce proper authorization

## Timeline Feature Requirements Tested

The tests verify the following requirements for the timeline feature:

- Users can create, read, update, and delete events
- Events are displayed in chronological order
- Media attachments can be added to events
- Events can be exported to PDF or Word format
- Timeline is accessible to both clients and their lawyers
- Data is properly secured from unauthorized access 