import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function startMongoMemoryServer() {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Override the MONGODB_URI environment variable
    process.env.MONGODB_URI = uri;
    console.log(`MongoDB Memory Server running at ${uri}`);
    
    return uri;
  }
  
  return mongoServer.getUri();
}

export async function stopMongoMemoryServer() {
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
    console.log('MongoDB Memory Server stopped');
  }
} 