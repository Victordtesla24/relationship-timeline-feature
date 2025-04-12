import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'lawyer']),
});

export async function POST(request: Request) {
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
        { status: 400 }
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
        { status: 409 }
      );
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the pre-save hook in the model
      role,
    });
    console.log('User created successfully with ID:', user._id);

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
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
      { status: 500 }
    );
  }
} 