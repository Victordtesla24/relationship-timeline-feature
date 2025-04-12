import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Register | Relationship Timeline App',
  description: 'Create a new Relationship Timeline account',
};

// Force dynamic rendering to ensure most up-to-date content
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create a new account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in instead
            </Link>
          </p>
          
          {/* Help message about registration using public API endpoint */}
          <div className="mt-2 text-xs text-gray-500">
            <p>
              If registration fails, we'll automatically try our direct registration service.
            </p>
          </div>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
} 