'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Timeline from '@/components/timeline/Timeline';

// This is a special development-only page for testing the timeline
// without requiring authentication
export default function DevTimelinePage() {
  // @ts-ignore - using useState directly from React object due to import errors
  const [mounted, setMounted] = React.useState(false);
  // @ts-ignore - using useState directly from React object due to import errors
  const [testUser, setTestUser] = React.useState({
    id: 'dev-test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  });
  // @ts-ignore - using useState directly from React object due to import errors
  const [loading, setLoading] = React.useState(true);

  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    setMounted(true);
    
    // Fetch test user data from the development API
    fetch('/api/dev/test-user')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setTestUser(data);
        }
      })
      .catch(err => {
        console.error('Error fetching test user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Create a mock session for development
  const mockSession = {
    user: testUser,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };

  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          role="status" 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>Development Mode:</strong> This is a special development-only page for testing the timeline.
        </p>
        <p className="text-yellow-600 text-sm mt-1">
          Using test user: {testUser.name} ({testUser.id})
        </p>
      </div>
      
      <SessionProvider session={mockSession}>
        <Timeline />
      </SessionProvider>
    </div>
  );
} 