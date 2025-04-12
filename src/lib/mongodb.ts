import mongoose from 'mongoose';
import { startMongoMemoryServer } from './mongodb-memory-server';

// Define the type for our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnected: number;
}

// Add mongoose to the NodeJS global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Get MONGODB_URI from environment (might be overridden by memory server)
let MONGODB_URI = process.env.MONGODB_URI;

// Check if we're in a development or test environment
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
const isServerless = process.env.VERCEL === '1';

// Connection expiry time in milliseconds (5 minutes for serverless)
const CONNECTION_EXPIRY = 5 * 60 * 1000;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { 
    conn: null, 
    promise: null,
    lastConnected: 0
  };
}

async function dbConnect() {
  // If we have an active connection that's still fresh, use it
  if (cached.conn) {
    // In serverless, check if the connection is stale
    if (isServerless && Date.now() - cached.lastConnected > CONNECTION_EXPIRY) {
      console.log('MongoDB connection is stale, reconnecting...');
      cached.conn = null;
      cached.promise = null;
    } else {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }
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

  const uri = MONGODB_URI.toString();
  
  // Mask the password in the URI for logging
  const maskedUri = uri.includes('@') 
    ? uri.substring(0, uri.indexOf('://') + 3) + 
      uri.substring(uri.indexOf('://') + 3, uri.indexOf(':') + 1) + 
      '******' + 
      uri.substring(uri.indexOf('@'))
    : uri;
  
  console.log('Connecting to MongoDB at:', maskedUri);

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased timeout for server selection
      connectTimeoutMS: 10000, // Connection timeout
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Use IPv4, avoid IPv6 issues
      maxPoolSize: isServerless ? 10 : 100, // Reduce pool size in serverless
      minPoolSize: isServerless ? 1 : 5,
    };

    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(uri, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        cached.lastConnected = Date.now();
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
    cached.lastConnected = Date.now();
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    console.error('Failed to resolve MongoDB connection:', error.message);
    
    // If in serverless and connection fails, retry once with a new connection
    if (isServerless && !error.message.includes('retry')) {
      console.log('Retrying MongoDB connection in serverless environment...');
      cached.promise = null;
      try {
        return await dbConnect();
      } catch (retryError: any) {
        console.error('MongoDB connection retry failed:', retryError.message);
        throw new Error(`MongoDB connection failed after retry: ${retryError.message}`);
      }
    }
    
    throw error;
  }
}

export default dbConnect; 