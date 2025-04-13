import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/Toaster';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import DevBanner with no SSR to allow it to check environment
const DevBanner = dynamic(() => import('@/components/ui/DevBanner'), { ssr: false });

// Dynamically import LocalStorageInitializer with no SSR to safely access window/localStorage
const LocalStorageInitializer = dynamic(() => import('@/components/LocalStorageInitializer'), { ssr: false });

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
      <body className="min-h-screen bg-slate-50">
        <LocalStorageInitializer />
        {process.env.NODE_ENV === 'development' && <DevBanner />}
        {children}
        <Toaster />
      </body>
    </html>
  );
} 