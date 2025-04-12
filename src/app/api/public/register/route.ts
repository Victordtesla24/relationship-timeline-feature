import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// No authentication protection for this public endpoint
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'lawyer']),
});

export async function POST(request: Request) {
  // Add CORS headers to ensure browser requests work
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    // Connect to database
    console.log('Public API: Connecting to MongoDB...');
    await dbConnect();
    console.log('Public API: Connected to MongoDB successfully');

    // Parse and validate request body
    const body = await request.json();
    console.log('Public API: Received registration request', { ...body, password: '[REDACTED]' });
    
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      console.log('Public API: Validation error:', validationResult.error.errors);
      return NextResponse.json(
        { message: 'Invalid input data', errors: validationResult.error.errors },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    const { name, email, password, role } = validationResult.data;

    // Check if user already exists
    console.log('Public API: Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Public API: User already exists');
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { 
          status: 409,
          headers: corsHeaders 
        }
      );
    }

    // Create new user
    console.log('Public API: Creating new user...');
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the pre-save hook in the model
      role,
    });
    console.log('Public API: User created successfully with ID:', user._id);

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { 
        status: 201,
        headers: corsHeaders 
      }
    );
  } catch (error: any) {
    console.error('Public API: Registration error:', error);
    
    // Provide more detailed error information
    const errorDetails = {
      message: 'Error registering user',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code,
      name: error.name
    };
    
    return NextResponse.json(
      errorDetails,
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 