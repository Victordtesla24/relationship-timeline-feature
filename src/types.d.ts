// Type definitions to fix TS errors

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
    html: any;
    head: any;
    body: any;
  }
}

// Define the FC type for our components
type FC<P = {}> = React.FunctionComponent<P>;

// Define the React namespace
declare namespace React {
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
  
  interface ReactNodeArray extends Array<ReactNode> {}
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type Key = string | number;
  
  interface JSXElementConstructor<P> {
    (props: P): ReactElement<any, any> | null;
  }
  
  // Event interfaces
  interface FormEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  interface SyntheticEvent<T = Element> {
    currentTarget: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
  }
  
  // HTML element attribute interfaces
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
  }
  
  interface HTMLAttributes<T> {
    className?: string;
    id?: string;
    style?: any;
    children?: ReactNode;
  }
  
  // React hook signatures - Adding proper exports to fix errors
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
}

// Fix event handlers
type FormEventHandler<T = Element> = (event: React.FormEvent<T>) => void;
type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;

// Define Event interface
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  mediaIds: string[];
  commentIds?: string[];
  createdAt: string;
  updatedAt: string;
  relationshipId?: string | null;
}

// Extend modules for component props
declare module '@/components/ui/Toaster' {
  export function Toaster(): JSX.Element;
}

// These are needed for importing CSS/SCSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Fix Next.js React compatibility
declare module 'next' {
  export interface LayoutProps {
    children: React.ReactNode;
  }
}

// Add Jest test types
declare namespace jest {
  interface Matchers<R> {
    toEqual(expected: any): R;
    toBeTruthy(): R;
    toHaveTextContent(text: string): R;
  }
  interface Expect {
    any(constructor: any): any;
  }
}

// For libraries without type definitions
declare module 'react' {
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type Key = string | number;

  export interface JSXElementConstructor<P> {
    (props: P): ReactElement<any, any> | null;
  }

  export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    onSubmit?: FormEventHandler<T>;
    children?: ReactNode;
  }

  export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    htmlFor?: string;
    children?: ReactNode;
  }

  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    name?: string;
    id?: string;
    value?: string | number | readonly string[];
    onChange?: ChangeEventHandler<T>;
  }

  export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
    id?: string;
    value?: string | number | readonly string[];
    onChange?: ChangeEventHandler<T>;
    children?: ReactNode;
  }

  export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | number | readonly string[];
    selected?: boolean;
    children?: ReactNode;
  }

  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    children?: ReactNode;
  }

  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  
  export interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T & EventTarget;
    currentTarget: T & EventTarget;
  }
  
  export interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
    currentTarget: T;
  }

  export type FormEventHandler<T = Element> = (event: FormEvent<T>) => void;
  export type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;
  export type MouseEventHandler<T = Element> = (event: MouseEvent<T>) => void;

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;

  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }

  export interface Provider<T> {
    (props: { value: T; children: React.ReactNode }): React.ReactElement | null;
  }

  export interface Consumer<T> {
    (props: { children: (value: T) => React.ReactNode }): React.ReactElement | null;
  }

  export type ReactNode = ReactElement | string | number | boolean | null | undefined;
  
  // HTML Element types for better Next.js support
  export interface HTMLAttributes<T> {
    className?: string;
    lang?: string;
    style?: any;
    children?: ReactNode;
  }
  
  export interface HTMLProps<T> extends HTMLAttributes<T> {
    children?: ReactNode;
  }
  
  // Add ForwardRefExoticComponent for Button component
  export interface ForwardRefExoticComponent<P> {
    (props: P): ReactElement | null;
    displayName?: string;
  }

  export interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> {
    [key: string]: any;
  }

  // Add specific HTML element interfaces
  export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
    lang?: string;
    children?: ReactNode;
  }

  export interface BodyHTMLAttributes<T> extends HTMLAttributes<T> {
    className?: string;
    children?: ReactNode;
  }

  export interface HeadHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: ReactNode;
  }
}

// Import the types from the existing types.d.ts
import * as React from 'react';
import 'next';

// Declare JSX namespace for proper element handling in Next.js
declare namespace JSX {
  interface IntrinsicElements {
    html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
    head: React.DetailedHTMLProps<React.HeadHTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
    body: React.DetailedHTMLProps<React.BodyHTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
  }
} 