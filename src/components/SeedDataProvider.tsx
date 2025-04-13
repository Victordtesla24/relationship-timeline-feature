'use client';

import React from 'react';
import { seedInitialData } from '@/utils/localStorage';

interface SeedDataProviderProps {
  children: React.ReactNode;
}

export default function SeedDataProvider({ children }: SeedDataProviderProps) {
  // Use useEffect to call seedInitialData once on client side
  React.useEffect(() => {
    seedInitialData();
  }, []);

  return <>{children}</>;
} 