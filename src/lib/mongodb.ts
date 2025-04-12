import mongoose from 'mongoose';
import { startMongoMemoryServer } from './mongodb-memory-server';

// Define the type for our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add mongoose to the NodeJS global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Get MONGODB_URI from environment (might be overridden by memory server)
let MONGODB_URI = process.env.MONGODB_URI;

// Check if we're in a development or test environment
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  // Start memory server in development or test mode if using localhost
  if (isDevelopment && (!MONGODB_URI || MONGODB_URI.includes('localhost'))) {
    console.log('Starting MongoDB memory server for development/test');
    MONGODB_URI = await startMongoMemoryServer();
  }

  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not defined');
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  console.log('Connecting to MongoDB at:', MONGODB_URI.substring(0, MONGODB_URI.indexOf('@') + 1) + '***');

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased timeout for server selection
      connectTimeoutMS: 10000, // Connection timeout
      socketTimeoutMS: 45000, // Socket timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB connection error details:', {
          message: error.message,
          code: error.code,
          name: error.name,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    console.error('Failed to resolve MongoDB connection:', error.message);
    throw error;
  }
}

export default dbConnect; 