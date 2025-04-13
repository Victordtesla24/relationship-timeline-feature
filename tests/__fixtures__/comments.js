/**
 * Comment test fixtures
 */

export const comment1 = {
  _id: 'comment123',
  text: 'This was an important event',
  eventId: 'event456',
  createdAt: new Date('2023-01-05'),
  updatedAt: new Date('2023-01-05'),
};

export const comment2 = {
  _id: 'comment456',
  text: 'Added additional details for context',
  eventId: 'event456',
  createdAt: new Date('2023-01-10'),
  updatedAt: new Date('2023-01-15'),
};

export const comment3 = {
  _id: 'comment789',
  text: 'Requesting clarification on this item',
  eventId: 'event789',
  createdAt: new Date('2023-03-07'),
  updatedAt: new Date('2023-03-07'),
};

export const newCommentData = {
  text: 'This is a new comment for testing',
  eventId: 'event456',
};

export const invalidCommentData = {
  text: '',
  eventId: 'event456',
}; 