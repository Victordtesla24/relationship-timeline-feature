/**
 * Event test fixtures
 */

export const event1 = {
  _id: 'event456',
  title: 'First Date',
  description: 'We went to that new Italian restaurant downtown',
  date: new Date('2023-01-01'),
  location: 'Bella Italia Restaurant',
  relationshipId: 'relationship123',
  tags: ['romantic', 'food'],
  mediaIds: ['media123', 'media456'],
  commentIds: ['comment123', 'comment456'],
  createdAt: new Date('2023-01-02'),
  updatedAt: new Date('2023-01-02'),
};

export const event2 = {
  _id: 'event789',
  title: 'Trip to the Beach',
  description: 'Spent the weekend at Malibu',
  date: new Date('2023-03-05'),
  location: 'Malibu Beach',
  relationshipId: 'relationship123',
  tags: ['trip', 'outdoor'],
  mediaIds: ['media789'],
  commentIds: ['comment789'],
  createdAt: new Date('2023-03-06'),
  updatedAt: new Date('2023-03-06'),
};

export const event3 = {
  _id: 'event101',
  title: 'Anniversary Dinner',
  description: 'Celebrated our first year together',
  date: new Date('2024-01-01'),
  location: 'Home',
  relationshipId: 'relationship456',
  tags: ['anniversary', 'celebration'],
  mediaIds: [],
  commentIds: [],
  createdAt: new Date('2024-01-02'),
  updatedAt: new Date('2024-01-02'),
};

export const newEventData = {
  title: 'Concert Night',
  description: 'Saw our favorite band live',
  date: new Date('2024-02-15'),
  location: 'City Arena',
  relationshipId: 'relationship123',
  tags: ['music', 'entertainment'],
};

export const invalidEventData = {
  title: '',
  description: 'Missing required title',
  date: 'invalid-date',
  relationshipId: '',
};

/**
 * Test fixture for event data
 * Contains sample events for testing timeline functionality
 */

import { clientUser, lawyerUser, anotherClientUser } from './users';

export const clientEvents = [
  {
    _id: '61d0fe4f5311236168a209ca',
    title: 'First Meeting',
    description: 'The day we first met at the coffee shop',
    date: new Date('2022-01-15T12:00:00Z'),
    userId: clientUser._id,
    mediaIds: ['71d0fe4f5311236168a109ca'],
    createdAt: new Date('2023-02-01T00:00:00Z'),
    updatedAt: new Date('2023-02-01T00:00:00Z')
  },
  {
    _id: '61d0fe4f5311236168a209cb',
    title: 'Moving In Together',
    description: 'We rented our first apartment',
    date: new Date('2022-06-10T15:30:00Z'),
    userId: clientUser._id,
    mediaIds: ['71d0fe4f5311236168a109cb', '71d0fe4f5311236168a109cc'],
    createdAt: new Date('2023-02-02T00:00:00Z'),
    updatedAt: new Date('2023-02-02T00:00:00Z')
  },
  {
    _id: '61d0fe4f5311236168a209cc',
    title: 'Separation Discussion',
    description: 'Initial conversation about separating',
    date: new Date('2023-03-03T18:00:00Z'),
    userId: clientUser._id,
    mediaIds: [],
    createdAt: new Date('2023-03-05T00:00:00Z'),
    updatedAt: new Date('2023-03-05T00:00:00Z')
  }
];

export const anotherClientEvents = [
  {
    _id: '61d0fe4f5311236168a209cd',
    title: 'Initial Meeting',
    description: 'Met at a party',
    date: new Date('2021-12-31T22:00:00Z'),
    userId: anotherClientUser._id,
    mediaIds: [],
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z')
  }
];

// Sample event for creation tests
export const newEvent = {
  title: 'Engagement',
  description: 'Proposal at the beach',
  date: new Date('2022-07-04T19:30:00Z'),
  mediaIds: []
};

// Sample event for update tests
export const updatedEventData = {
  title: 'Updated Event Title',
  description: 'Updated description for testing',
  date: new Date('2022-08-15T14:00:00Z')
};

// Invalid event data for validation testing
export const invalidEvent = {
  title: '',
  description: '',
  date: 'not-a-date'
}; 