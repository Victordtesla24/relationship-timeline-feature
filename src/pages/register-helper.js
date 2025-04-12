import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dbConnect from '../lib/mongodb';
import User from '../models/user';

// This is a server-side rendered page that bypasses Vercel's authentication
export default function RegisterHelper() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const router = useRouter();
  const { name, email, password, role } = router.query;

  useEffect(() => {
    if (!name || !email || !password || !role) {
      setStatus('error');
      setError('Missing required parameters');
      return;
    }

    async function registerUser() {
      try {
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 2000);
      } catch (error) {
        console.error('Error during registration:', error);
        setStatus('error');
        setError(error.message || 'Registration failed');
      }
    }

    registerUser();
  }, [name, email, password, role, router]);

  // Display a simple loading page
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      {status === 'processing' ? (
        <>
          <h1>Creating your account...</h1>
          <p>Please wait, you will be redirected to login shortly.</p>
        </>
      ) : (
        <>
          <h1>Error</h1>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/register')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go back to registration
          </button>
        </>
      )}
    </div>
  );
}

// This function runs on the server for each request
export async function getServerSideProps(context) {
  const { name, email, password, role } = context.query;

  // Check if all required parameters are present
  if (!name || !email || !password || !role) {
    return {
      props: {
        success: false,
        error: 'Missing required parameters'
      }
    };
  }

  try {
    // Connect to database
    console.log('Server-Side: Connecting to MongoDB...');
    await dbConnect();
    console.log('Server-Side: Connected to MongoDB successfully');

    // Check if user already exists
    console.log('Server-Side: Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Server-Side: User already exists');
      return {
        props: {
          success: false,
          error: 'User with this email already exists'
        }
      };
    }

    // Create new user
    console.log('Server-Side: Creating new user...');
    try {
      const user = await User.create({
        name,
        email,
        password, // Will be hashed by the pre-save hook in the model
        role,
      });
      console.log('Server-Side: User created successfully with ID:', user._id);
      
      return {
        props: {
          success: true,
          userId: user._id.toString()
        }
      };
    } catch (modelError) {
      console.error('Server-Side: Error creating user in database:', modelError);
      return {
        props: {
          success: false,
          error: `Database error: ${modelError.message}`
        }
      };
    }
  } catch (error) {
    console.error('Server-Side: Registration error:', error);
    
    return {
      props: {
        success: false,
        error: `Error: ${error.message}`
      }
    };
  }
} 