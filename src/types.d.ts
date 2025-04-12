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

// Type definitions for React and Next.js compatibility

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
  
  // React hook signatures
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
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
  userId: string;
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

// For libraries without type definitions
declare namespace React {
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

declare module 'react' {
  export = React;
}

declare module 'next/image' {
  export default function Image(props: any): JSX.Element;
}

declare module 'next/link' {
  export default function Link(props: any): JSX.Element;
}

declare module 'date-fns' {
  export function format(date: Date, format: string): string;
}

declare module 'next-auth/react' {
  export function useSession(): {
    data: any;
    status: string;
  };
  export function signIn(provider: string, options?: any): Promise<any>;
  export function signOut(options?: any): Promise<any>;
  export function SessionProvider(props: any): JSX.Element;
}

// NextAuth Session Type Extensions
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Timeline component types
declare module '@/components/timeline/Timeline' {
  export default function Timeline(): JSX.Element;
}

declare module '@/components/timeline/EventCard' {
  interface EventCardProps {
    event: Event;
    index: number;
    onEventUpdated?: (updatedEvent: Event) => void;
    onEventDeleted?: (eventId: string) => void;
  }
  export default function EventCard(props: EventCardProps): JSX.Element;
}

declare module '@/components/timeline/EditEventModal' {
  interface EditEventModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
    onEventUpdated?: (updatedEvent: Event) => void;
    onEventDeleted?: (eventId: string) => void;
  }
  export default function EditEventModal(props: EditEventModalProps): JSX.Element;
}

declare module '@/components/timeline/AddEventModal' {
  interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventAdded?: (event: Event) => void;
  }
  export default function AddEventModal(props: AddEventModalProps): JSX.Element;
}

// Dashboard component types
declare module '@/components/dashboard/DashboardHeader' {
  export default function DashboardHeader(): JSX.Element;
}

declare module '@/components/dashboard/TimelineSummary' {
  export default function TimelineSummary(): JSX.Element;
}

declare module '@/components/dashboard/RecentActivity' {
  export default function RecentActivity(): JSX.Element;
}

// Export component types
declare module '@/components/export/ExportContent' {
  export default function ExportContent(): JSX.Element;
}

// UI component types
declare module '@/components/ui/Toaster' {
  interface ToastOptions {
    title: string;
    description?: string;
    type: 'default' | 'success' | 'error' | 'warning';
  }
  
  interface ToasterService {
    toast: (props: ToastOptions) => string;
    dismiss: (id: string) => void;
  }
  
  // Export types only, not implementations
  export interface Props {}
  export type ToasterProps = Props;
}

// Simplify Button declarations
declare module '@/components/ui/Button' {
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean;
    href?: string;
    className?: string;
  }
  
  // Export type only, not implementation
  export type { ButtonProps };
}

// Test library declarations
declare module '@testing-library/react' {
  export function render(component: any, options?: any): any;
  export const screen: {
    getByText(text: string | RegExp): any;
    getByLabelText(label: string | RegExp): any;
    getByRole(role: string, options?: any): any;
    getByTestId(id: string): any;
    getByPlaceholderText(text: string | RegExp): any;
    getAllByText(text: string | RegExp): any[];
    getAllByRole(role: string, options?: any): any[];
    getAllByLabelText(label: string | RegExp): any[];
    getAllByPlaceholderText(text: string | RegExp): any[];
    getAllByTestId(regex: RegExp): any[];
    queryByText(text: string | RegExp): any;
    queryByTestId(id: string): any;
    queryByRole(role: string, options?: any): any;
    queryByLabelText(label: string | RegExp): any;
    queryAllByText(text: string | RegExp): any[];
  };
  export const fireEvent: {
    click(element: any): void;
    change(element: any, options: any): void;
  };
  export function waitFor(callback: () => void, options?: any): Promise<void>;
}

// Jest globals
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockReturnValue(value: T): this;
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: any): this;
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockClear(): this;
    }
    
    function fn<T = any>(): Mock<T>;
    function clearAllMocks(): void;
    
    interface Matchers<R> {
      toBeNull(): R;
      toBe(expected: any): R;
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveTextContent(text: string): R;
      toEqual(expected: any): R;
      toBeGreaterThan(expected: number): R;
      toBeLessThan(expected: number): R;
      not: {
        toBeNull(): R;
        toBeInTheDocument(): R;
        toHaveClass(className: string): R;
        toHaveBeenCalled(): void;
        toEqual(expected: any): R;
        toBe(expected: any): R;
      };
    }
  }
  
  // Jest methods
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function expect(actual: any): {
    toBeInTheDocument(): void;
    toBeVisible(): void;
    toHaveClass(className: string): void;
    toHaveValue(value: string): void;
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toContain(expected: any): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toHaveTextContent(text: string): void;
    rejects: {
      toThrow(message?: string): void;
    };
    not: {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
      toHaveBeenCalled(): void;
      toBe(expected: any): void;
      toEqual(expected: any): void;
    };
    toHaveBeenCalled(): void;
    toHaveBeenCalledTimes(count: number): void;
    toHaveBeenCalledWith(...args: any[]): void;
    any(constructor: any): any;
  };
  
  // Add namespace for expect static methods
  namespace expect {
    function any(constructor: any): any;
  }
  
  const global: {
    fetch: jest.Mock;
    TextEncoder: any;
    TextDecoder: any;
    Response: any;
    Request: any;
    Headers: any;
  };
}

// Import the types from the existing types.d.ts
import * as React from 'react';
import 'next';

// Extend Next.js types to accept React nodes in children
declare module 'next' {
  export interface LayoutProps {
    children: React.ReactNode;
  }
}

// Declare JSX namespace for proper element handling in Next.js
declare namespace JSX {
  interface IntrinsicElements {
    html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
    head: React.DetailedHTMLProps<React.HeadHTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
    body: React.DetailedHTMLProps<React.BodyHTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
  }
}

// Declare Module to fix toaster component
declare module '@/components/ui/Toaster' {
  export function Toaster(): JSX.Element;
}

// This allows TypeScript to import CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
} 