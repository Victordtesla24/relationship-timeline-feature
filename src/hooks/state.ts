// This file exports React hooks with proper TypeScript typing
import React from 'react';

/**
 * Properly typed React hooks for consistent usage across the application
 * without TypeScript errors during build time
 */

// Typed version of useState
export const useState: typeof React.useState = React.useState;

// Typed version of useEffect
export const useEffect: typeof React.useEffect = React.useEffect;

// Typed version of useCallback
export const useCallback: typeof React.useCallback = React.useCallback;

// Typed version of useMemo
export const useMemo: typeof React.useMemo = React.useMemo;

// Typed version of useRef
export const useRef: typeof React.useRef = React.useRef; 