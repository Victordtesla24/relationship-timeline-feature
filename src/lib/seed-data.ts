import dbConnect from './mongodb';
import Event from '@/models/event';
import { ObjectId } from 'mongodb';

const testUserId = new ObjectId().toString();

// Do not try to modify process.env directly in runtime code
// Instead, use the exported testUserId value

export async function seedDatabase() {
  await dbConnect();
  
  // Check if there are any events in the database
  const count = await Event.countDocuments();
  
  // Only seed if the database is empty
  if (count === 0) {
    console.log('Seeding database with test data...');
    
    // Create sample events
    const events = [
      {
        title: 'First Meeting',
        description: 'The day we first met at the coffee shop.',
        date: new Date('2023-01-15'),
        userId: testUserId,
        mediaIds: [],
      },
      {
        title: 'First Date',
        description: 'Our first official date at the restaurant.',
        date: new Date('2023-02-10'),
        userId: testUserId,
        mediaIds: [],
      },
      {
        title: 'Weekend Trip',
        description: 'Our first weekend getaway to the mountains.',
        date: new Date('2023-04-22'),
        userId: testUserId,
        mediaIds: [],
      },
    ];
    
    // Insert events into the database
    await Event.insertMany(events);
    console.log('Database seeded successfully!');
    console.log('Test User ID:', testUserId);
  }
}

export const testUser = {
  id: testUserId,
  name: 'Test User',
  email: 'test@example.com',
}; 