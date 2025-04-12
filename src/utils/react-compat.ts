import React from 'react';

/**
 * This utility provides workarounds for TypeScript errors related to React hooks
 * that occur due to conflicts between the project's type definitions.
 * 
 * These functions maintain full functionality while suppressing TypeScript errors.
 */

// Use type assertion to work around React type conflicts
const ReactCompat = React as any;

/**
 * useState hook wrapper that avoids TypeScript errors
 */
export function useStateCompat<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void] {
  return ReactCompat.useState(initialState);
}

/**
 * useRef hook wrapper that avoids TypeScript errors
 */
export function useRefCompat<T>(initialValue: T | null): { current: T | null } {
  return ReactCompat.useRef(initialValue);
}

/**
 * useEffect hook wrapper that avoids TypeScript errors
 */
export function useEffectCompat(effect: () => void | (() => void), deps?: any[]): void {
  return ReactCompat.useEffect(effect, deps);
}

/**
 * useCallback hook wrapper that avoids TypeScript errors
 */
export function useCallbackCompat<T extends (...args: any[]) => any>(callback: T, deps: any[]): T {
  return ReactCompat.useCallback(callback, deps);
}

/**
 * useMemo hook wrapper that avoids TypeScript errors
 */
export function useMemoCompat<T>(factory: () => T, deps: any[]): T {
  return ReactCompat.useMemo(factory, deps);
}

/**
 * useContext hook wrapper that avoids TypeScript errors
 */
export function useContextCompat<T>(context: any): T {
  return ReactCompat.useContext(context);
}

export default ReactCompat; 