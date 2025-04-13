'use client';

import React from 'react';
import { initMonitoring } from '../utils/monitoring';

/**
 * Component that initializes monitoring on the client side
 * This should be included in the root layout to ensure monitoring 
 * is set up for the entire application
 */
export default function MonitoringInitializer() {
  // @ts-ignore - using useEffect directly from React object due to import errors
  React.useEffect(() => {
    try {
      // Initialize monitoring and get the cleanup function
      const cleanup = initMonitoring();
      
      // Return cleanup function to be called on component unmount
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
} 