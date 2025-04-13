import React from 'react';

/**
 * This utility provides proper TypeScript compatibility for React hooks
 * that might encounter conflicts between the project's type definitions.
 * 
 * The implementation ensures type safety while maintaining full functionality.
 */

/**
 * useState hook with proper TypeScript types
 */
export function useStateCompat<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void] {
  return React.useState<T>(initialState);
}

/**
 * useRef hook with proper TypeScript types
 */
export function useRefCompat<T>(initialValue: T | null): { current: T | null } {
  return React.useRef<T | null>(initialValue);
}

/**
 * useEffect hook with proper TypeScript types
 */
export function useEffectCompat(effect: () => void | (() => void), deps?: React.DependencyList): void {
  return React.useEffect(effect, deps);
}

/**
 * useCallback hook with proper TypeScript types
 */
export function useCallbackCompat<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T {
  return React.useCallback(callback, deps);
}

/**
 * useMemo hook with proper TypeScript types
 */
export function useMemoCompat<T>(factory: () => T, deps: React.DependencyList): T {
  return React.useMemo(factory, deps);
}

/**
 * useContext hook with proper TypeScript types
 */
export function useContextCompat<T>(context: React.Context<T>): T {
  return React.useContext(context);
}

/**
 * Safely exported React for compatibility usage
 * This ensures all components have access to the standard React API
 * without TypeScript conflicts
 */
const ReactCompat = {
  useState: useStateCompat,
  useEffect: useEffectCompat,
  useRef: useRefCompat,
  useCallback: useCallbackCompat,
  useMemo: useMemoCompat,
  useContext: useContextCompat,
  Fragment: React.Fragment,
  createElement: React.createElement,
  createContext: React.createContext,
  forwardRef: React.forwardRef,
  Children: React.Children,
  cloneElement: React.cloneElement,
  isValidElement: React.isValidElement
};

export default ReactCompat; 