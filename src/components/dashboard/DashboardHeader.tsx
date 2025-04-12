'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Export', href: '/export' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            Relationship Timeline
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {session?.user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{session.user.name}</span>
                <span className="text-xs ml-2 bg-gray-100 px-2 py-1 rounded">
                  {session.user.role}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-700 hover:text-primary-600"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-3 px-4 border-t">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {session?.user && (
            <div className="mt-4 pt-4 border-t flex flex-col space-y-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{session.user.name}</span>
                <span className="text-xs ml-2 bg-gray-100 px-2 py-1 rounded">
                  {session.user.role}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
} 