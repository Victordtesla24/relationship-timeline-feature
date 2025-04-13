'use client';

import React from 'react';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-primary-600 hover:text-primary-800 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/relationships"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Relationships
            </Link>
            <Link
              href="/export"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 