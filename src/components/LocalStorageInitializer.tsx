'use client';

import React from 'react';
import { seedInitialData } from '@/utils/localStorage';

export default function LocalStorageInitializer() {
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    // Initialize localStorage with sample data if needed
    seedInitialData();
  }, []);

  // This component doesn't render anything visible
  return null;
} 