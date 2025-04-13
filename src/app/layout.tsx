import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/Toaster';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import DevBanner with no SSR to allow it to check environment
const DevBanner = dynamic(() => import('@/components/ui/DevBanner'), { ssr: false });

// Dynamically import LocalStorageInitializer with no SSR to safely access window/localStorage
const LocalStorageInitializer = dynamic(() => import('@/components/LocalStorageInitializer'), { ssr: false });

// Dynamically import Header 
const Header = dynamic(() => import('@/components/ui/Header'), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Relationship Timeline App',
  description: 'Document and track your relationship timeline with visual elements',
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head />
      <body className="min-h-screen bg-slate-50 flex flex-col">
        <LocalStorageInitializer />
        {process.env.NODE_ENV === 'development' && <DevBanner />}
        <Header />
        <main className="flex-grow py-6">
          {children}
        </main>
        <footer className="bg-white py-6 border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5 text-primary-600 mr-2"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Relationship Timeline</span>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Relationship Timeline. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
} 