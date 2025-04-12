import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Disable edge runtime to ensure compatibility with bcrypt
export const preferredRegion = 'auto';

// No authentication protection for this public endpoint
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'lawyer']),
});

export async function POST(request: Request) {
  // Add CORS headers
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'https://relationship-timeline-feature-kqg270foa-vics-projects-31447d42.vercel.app',
    'https://relationship-timeline-feature.vercel.app',
    '*' // Allow any origin for public API
  ];
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Public endpoint - allow any origin
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
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
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected to MongoDB successfully');

    // Parse and validate request body
    const body = await request.json();
    console.log('Received registration request', { ...body, password: '[REDACTED]' });
    
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      console.log('Validation error:', validationResult.error.errors);
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
    console.log('Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { 
          status: 409,
          headers: corsHeaders 
        }
      );
    }

    // Create new user with a try/catch specifically for the model create operation
    console.log('Creating new user...');
    let user;
    try {
      user = await User.create({
        name,
        email,
        password, // Will be hashed by the pre-save hook in the model
        role,
      });
      console.log('User created successfully with ID:', user._id);
    } catch (modelError: any) {
      console.error('Error creating user in database:', modelError);
      return NextResponse.json(
        { 
          message: 'Database error during user creation', 
          error: modelError.message,
          code: modelError.code 
        },
        { 
          status: 500,
          headers: corsHeaders 
        }
      );
    }

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { 
        status: 201,
        headers: corsHeaders 
      }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
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
      'Access-Control-Allow-Origin': '*', // Public endpoint - allow any origin
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
} 