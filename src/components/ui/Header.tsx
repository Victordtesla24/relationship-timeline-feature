'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useStateCompat } from '@/utils/react-compat';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useStateCompat(false);
  
  // Determine if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-7 w-7 text-white mr-2 group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-xl font-bold text-white">Relationship Timeline</span>
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link 
                href="/" 
                className={`text-sm font-medium py-2 transition-all duration-300 ${
                  isActiveLink('/') 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-primary-100 hover:text-white hover:border-b-2 hover:border-primary-200'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/timeline" 
                className={`text-sm font-medium py-2 transition-all duration-300 ${
                  isActiveLink('/timeline') 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-primary-100 hover:text-white hover:border-b-2 hover:border-primary-200'
                }`}
              >
                Timeline
              </Link>
              <Link 
                href="/export" 
                className={`text-sm font-medium py-2 transition-all duration-300 ${
                  isActiveLink('/export') 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-primary-100 hover:text-white hover:border-b-2 hover:border-primary-200'
                }`}
              >
                Export
              </Link>
            </nav>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-white hover:text-primary-100 p-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {!isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t border-primary-400 animate-slideInTop">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/timeline" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/timeline') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Timeline
              </Link>
              <Link 
                href="/export" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/export') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Export
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 