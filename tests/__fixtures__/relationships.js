/**
 * Relationship test fixtures
 */

export const relationship1 = {
  _id: 'relationship123',
  title: 'My Relationship with Sarah',
  description: 'Our journey together since college',
  startDate: new Date('2022-01-01'),
  endDate: null,
  status: 'active',
  tags: ['romantic', 'serious'],
  eventIds: ['event456', 'event789'],
  createdAt: new Date('2022-01-02'),
  updatedAt: new Date('2022-01-02'),
};

export const relationship2 = {
  _id: 'relationship456',
  title: 'My Relationship with John',
  description: 'We met at work',
  startDate: new Date('2023-01-01'),
  endDate: null,
  status: 'active',
  tags: ['romantic', 'new'],
  eventIds: ['event101'],
  createdAt: new Date('2023-01-02'),
  updatedAt: new Date('2023-01-02'),
};

export const relationship3 = {
  _id: 'relationship789',
  title: 'Past Relationship with Alex',
  description: 'My high school relationship',
  startDate: new Date('2020-05-15'),
  endDate: new Date('2021-08-20'),
  status: 'ended',
  tags: ['past', 'learning'],
  eventIds: [],
  createdAt: new Date('2020-05-16'),
  updatedAt: new Date('2021-08-21'),
};

export const newRelationshipData = {
  title: 'New Friendship',
  description: 'My new friendship with Jamie',
  startDate: new Date('2024-01-15'),
  status: 'active',
  tags: ['friendship', 'casual'],
};

export const invalidRelationshipData = {
  title: '',
  description: 'Missing required title',
  startDate: 'invalid-date',
};

/**
 * Test fixture for relationship data
 * Contains sample relationship data for testing timeline functionality
 */

export const clientRelationship = {
  _id: '81d0fe4f5311236168a109ca',
  title: 'Jane & John',
  startDate: new Date('2023-01-01T00:00:00Z'),
  status: 'active',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z')
};

export const anotherRelationship = {
  _id: '81d0fe4f5311236168a109cb',
  title: 'Alice & Bob',
  startDate: new Date('2022-05-15T00:00:00Z'),
  status: 'active',
  createdAt: new Date('2022-05-15T00:00:00Z'),
  updatedAt: new Date('2022-05-15T00:00:00Z')
};

// New relationship for creation tests
export const newRelationship = {
  title: 'New Test Relationship',
  startDate: new Date('2023-06-15T00:00:00Z')
};

// Updated relationship data for testing
export const updatedRelationshipData = {
  title: 'Updated Relationship Title',
  status: 'paused'
};

// Invalid relationship data for validation testing
export const invalidRelationship = {
  startDate: 'not-a-date'
}; 