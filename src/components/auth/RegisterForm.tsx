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

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError('Registration failed');
        setIsLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred during registration');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      {error && <div className="bg-red-50 p-4"><p className="text-red-700">{error}</p></div>}
      
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