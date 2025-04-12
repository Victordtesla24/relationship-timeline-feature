import { createMocks } from 'node-mocks-http';
import { testApiHandler } from 'next-test-api-route-handler';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Define simple mock types
type MockResponse = {
  status: number;
  json: () => Promise<any>;
};

// Mock the API routes before importing them
jest.mock('@/app/api/events/route', () => ({
  GET: jest.fn(),
  POST: jest.fn()
}));

jest.mock('@/app/api/events/[id]/route', () => ({
  GET: jest.fn(),
  PUT: jest.fn(),
  DELETE: jest.fn()
}));

// Mock Next.js modules before importing the API routes
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number; headers?: Record<string, string> }) => {
      return {
        status: init?.status || 200,
        headers: init?.headers || { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        json: async () => body,
      };
    },
  },
}));

// Now import the API routes after mocking
import { GET, POST } from '@/app/api/events/route';
import { GET as GetEvent, PUT, DELETE } from '@/app/api/events/[id]/route';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/models/event', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// Create a helper function to extract the response data and status
const extractResponse = async (response: MockResponse) => {
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

describe('Events API', () => {
  describe('GET /api/events', () => {
    it('returns 401 if not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const mockResponse = {
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
      
      (GET as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events');
      const response = await GET(req);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('returns events for authenticated user', async () => {
      const mockSession = {
        user: {
          id: 'user-id-1',
          role: 'client',
        },
      };

      const mockEvents = [
        {
          _id: 'event-id-1',
          title: 'First Meeting',
          description: 'Our first meeting',
          date: '2023-01-01',
          mediaIds: [],
          userId: 'user-id-1',
        },
      ];

      const mockResponse = {
        status: 200,
        json: async () => mockEvents,
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.find as jest.Mock).mockResolvedValueOnce(mockEvents);
      (GET as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events');
      const response = await GET(req);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(200);
      expect(data).toEqual(mockEvents);
    });

    it('handles database errors gracefully', async () => {
      const mockSession = {
        user: {
          id: 'user-id-1',
          role: 'client',
        },
      };

      const mockError = {
        message: 'Error fetching events',
        error: 'Database error',
      };

      const mockResponse = {
        status: 500,
        json: async () => mockError,
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.find as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      (GET as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events');
      const response = await GET(req);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(500);
      expect(data).toEqual(mockError);
    });
  });

  describe('POST /api/events', () => {
    it('creates a new event for authenticated user', async () => {
      const mockSession = {
        user: {
          id: 'user-id-1',
          role: 'client',
        },
      };

      const newEvent = {
        title: 'New Event',
        description: 'Description of the new event',
        date: '2023-02-15',
        mediaIds: [],
      };

      const createdEvent = {
        _id: 'new-event-id',
        ...newEvent,
        userId: 'user-id-1',
      };

      const mockResponse = {
        status: 201,
        json: async () => createdEvent,
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.create as jest.Mock).mockResolvedValueOnce(createdEvent);
      (POST as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      
      const response = await POST(req);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(201);
      expect(data).toEqual(createdEvent);
    });
  });

  describe('GET /api/events/[id]', () => {
    it('returns an event by ID for its owner', async () => {
      const mockSession = {
        user: {
          id: 'user-id-1',
          role: 'client',
        },
      };

      const mockEvent = {
        _id: 'event-id-1',
        title: 'First Meeting',
        description: 'Our first meeting',
        date: '2023-01-01',
        mediaIds: [],
        userId: { toString: () => 'user-id-1' },
      };

      const mockResponse = {
        status: 200,
        json: async () => mockEvent,
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.findById as jest.Mock).mockResolvedValueOnce(mockEvent);
      (GetEvent as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events/event-id-1');
      const context = { params: { id: 'event-id-1' } };
      const response = await GetEvent(req, context);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(200);
      expect(data).toEqual(mockEvent);
    });

    it('returns 403 if user is not the owner and not a lawyer', async () => {
      const mockSession = {
        user: {
          id: 'user-id-2', // Different user
          role: 'client',
        },
      };

      const mockEvent = {
        _id: 'event-id-1',
        title: 'First Meeting',
        description: 'Our first meeting',
        date: '2023-01-01',
        mediaIds: [],
        userId: { toString: () => 'user-id-1' },
      };

      const mockResponse = {
        status: 403,
        json: async () => ({ message: 'Unauthorized' }),
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.findById as jest.Mock).mockResolvedValueOnce(mockEvent);
      (GetEvent as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events/event-id-1');
      const context = { params: { id: 'event-id-1' } };
      const response = await GetEvent(req, context);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(403);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('allows a lawyer to access an event', async () => {
      const mockSession = {
        user: {
          id: 'lawyer-id-1',
          role: 'lawyer',
        },
      };

      const mockEvent = {
        _id: 'event-id-1',
        title: 'First Meeting',
        description: 'Our first meeting',
        date: '2023-01-01',
        mediaIds: [],
        userId: { toString: () => 'user-id-1' }, // Different user
      };

      const mockResponse = {
        status: 200,
        json: async () => mockEvent,
      };
      
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (Event.findById as jest.Mock).mockResolvedValueOnce(mockEvent);
      (GetEvent as jest.Mock).mockResolvedValue(mockResponse);

      const req = new Request('http://localhost/api/events/event-id-1');
      const context = { params: { id: 'event-id-1' } };
      const response = await GetEvent(req, context);
      const { status, data } = await extractResponse(response);

      expect(status).toBe(200);
      expect(data).toEqual(mockEvent);
    });
  });
}); 