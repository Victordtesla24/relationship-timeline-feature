/**
 * Test fixture for media data
 * Contains sample media attachments for testing timeline events
 */

import { clientUser, anotherClientUser } from './users';

export const mediaItems = [
  {
    _id: '71d0fe4f5311236168a109ca',
    url: 'https://res.cloudinary.com/demo/image/upload/v1123456789/samples/first-meeting.jpg',
    type: 'image',
    caption: 'Our first photo together',
    userId: clientUser._id,
    eventId: '61d0fe4f5311236168a209ca',
    createdAt: new Date('2023-02-01T00:00:00Z'),
    updatedAt: new Date('2023-02-01T00:00:00Z')
  },
  {
    _id: '71d0fe4f5311236168a109cb',
    url: 'https://res.cloudinary.com/demo/image/upload/v1123456790/samples/apartment-keys.jpg',
    type: 'image',
    caption: 'Keys to our new place',
    userId: clientUser._id,
    eventId: '61d0fe4f5311236168a209cb',
    createdAt: new Date('2023-02-02T00:00:00Z'),
    updatedAt: new Date('2023-02-02T00:00:00Z')
  },
  {
    _id: '71d0fe4f5311236168a109cc',
    url: 'https://res.cloudinary.com/demo/video/upload/v1123456791/samples/moving-day.mp4',
    type: 'video',
    caption: 'Moving day timelapse',
    userId: clientUser._id,
    eventId: '61d0fe4f5311236168a209cb',
    createdAt: new Date('2023-02-02T01:00:00Z'),
    updatedAt: new Date('2023-02-02T01:00:00Z')
  }
];

// Another user's media
export const anotherClientMedia = [
  {
    _id: '71d0fe4f5311236168a109cd',
    url: 'https://res.cloudinary.com/demo/image/upload/v1123456792/samples/another-client-photo.jpg',
    type: 'image',
    caption: 'New Year Party',
    userId: anotherClientUser._id,
    eventId: '61d0fe4f5311236168a209cd',
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z')
  }
];

// Media item for creation tests
export const newMediaItem = {
  url: 'https://res.cloudinary.com/demo/image/upload/v1123456793/samples/new-photo.jpg',
  type: 'image',
  caption: 'Sample new photo for testing',
  eventId: '61d0fe4f5311236168a209ca'
};

// Updated media data for testing
export const updatedMediaData = {
  caption: 'Updated caption for testing',
  url: 'https://res.cloudinary.com/demo/image/upload/v1123456794/samples/updated-photo.jpg'
};

// Invalid media data for validation testing
export const media2 = {
  _id: 'media456',
  url: 'https://res.cloudinary.com/example/image/upload/v1234567890/sample2.jpg',
  type: 'image',
  filename: 'sample2.jpg',
  eventId: 'event789',
  createdAt: new Date('2023-03-05'),
  updatedAt: new Date('2023-03-05'),
};

export const media3 = {
  _id: 'media789',
  url: 'https://res.cloudinary.com/example/raw/upload/v1234567890/document.pdf',
  type: 'document',
  filename: 'document.pdf',
  eventId: 'event789',
  createdAt: new Date('2023-03-05'),
  updatedAt: new Date('2023-03-05'),
};

export const newMediaData = {
  url: 'https://res.cloudinary.com/example/image/upload/v1234567890/new.jpg',
  type: 'image',
  filename: 'new.jpg',
  eventId: 'event123',
};

export const invalidMediaData = {
  url: '',
  type: 'invalid-type',
  filename: '',
  eventId: '',
}; 