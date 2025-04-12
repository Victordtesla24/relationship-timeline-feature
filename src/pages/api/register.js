// This is a traditional Next.js Pages API route,
// which doesn't get protected by Vercel's Auth

import dbConnect from '../../lib/mongodb';
import User from '../../models/user';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    console.log('Legacy API: Connecting to MongoDB...');
    await dbConnect();
    console.log('Legacy API: Connected to MongoDB successfully');

    // Get request body
    const { name, email, password, role } = req.body;
    
    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          role: !role ? 'Role is required' : null
        }
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    if (role !== 'client' && role !== 'lawyer') {
      return res.status(400).json({ 
        message: 'Role must be either client or lawyer' 
      });
    }

    // Check if user already exists
    console.log('Legacy API: Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Legacy API: User already exists');
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create new user
    console.log('Legacy API: Creating new user...');
    try {
      const user = await User.create({
        name,
        email,
        password, // Will be hashed by the pre-save hook in the model
        role,
      });
      console.log('Legacy API: User created successfully with ID:', user._id);
      
      return res.status(201).json({ 
        message: 'User registered successfully', 
        userId: user._id 
      });
    } catch (modelError) {
      console.error('Legacy API: Error creating user in database:', modelError);
      return res.status(500).json({ 
        message: 'Database error during user creation', 
        error: modelError.message 
      });
    }
  } catch (error) {
    console.error('Legacy API: Registration error:', error);
    
    return res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
} 