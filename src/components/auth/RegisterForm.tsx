'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'lawyer']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'client',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setDetailedError(null);

    try {
      console.log('Submitting registration form', { ...data, password: '[REDACTED]' });
      
      // Use the public API endpoint that bypasses Vercel's protection
      const apiUrl = new URL('/api/public/register', window.location.origin).toString();
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
        body: JSON.stringify(data),
      });

      try {
        // Get the response data for error details
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Registration failed', responseData);
          
          if (response.status === 409) {
            setError('Email already registered');
          } else if (response.status === 400) {
            setError('Invalid input data');
          } else {
            setError('Registration failed: ' + (responseData.message || 'Unknown error'));
          }
          
          // Set detailed error for development
          setDetailedError(responseData);
          setIsLoading(false);
          return;
        }

        console.log('Registration successful, redirecting to login');
        router.push('/login?registered=true');
      } catch (jsonError) {
        // If we can't parse the JSON, it might be a Vercel protection page
        console.error('Error parsing response:', jsonError);
        setError('Registration service is temporarily unavailable. Please try again later.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred during registration');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-700">{error}</p>
          
          {process.env.NODE_ENV === 'development' && detailedError && (
            <div className="mt-2 text-xs">
              <p className="font-semibold">Details:</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(detailedError, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input id="name" {...register('name')} type="text" className="mt-1 block w-full border rounded-md p-2" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" {...register('email')} type="email" className="mt-1 block w-full border rounded-md p-2" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" {...register('password')} type="password" className="mt-1 block w-full border rounded-md p-2" />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select id="role" {...register('role')} className="mt-1 block w-full border rounded-md p-2">
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary-600 text-white p-2 rounded-md"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
} 