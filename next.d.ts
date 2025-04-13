// Type augmentation for React
import 'react';

declare module 'react' {
  // Export all the React types
  export type ReactNode = React.ReactChild | React.ReactFragment | React.ReactPortal | boolean | null | undefined;
  export type ReactChild = React.ReactElement | React.ReactText;
  export type ReactText = string | number;
  export type ReactFragment = {} | React.ReactNodeArray;
  export type ReactNodeArray = Array<ReactNode>;
  export type ReactPortal = {
    readonly children: ReactNode;
    readonly containerInfo: any;
    readonly implementation: any;
    readonly key: string | null;
  };
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: React.Key | null;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null);
  export type Key = string | number;
  
  // Event types
  export interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: EventTarget & T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }
  
  export interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }

  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
  
  // HTML attributes
  export interface HTMLAttributes<T> {
    className?: string;
    id?: string;
    style?: any;
    onClick?: (event: MouseEvent<T>) => void;
    children?: ReactNode;
  }
  
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }
  
  export interface MouseEvent<T = Element> extends SyntheticEvent<T, NativeMouseEvent> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }
  
  interface NativeMouseEvent extends MouseEvent {}
  
  export type Ref<T> = RefCallback<T> | RefObject<T> | null;
  export type RefCallback<T> = (instance: T | null) => void;
  export interface RefObject<T> {
    readonly current: T | null;
  }
}

// Add ReactNode to Next.js
declare module 'next' {
  export interface LayoutProps {
    children: React.ReactNode;
  }
}

// Add missing modules - changing names to avoid conflicts
declare module '@/components/ui/Toaster' {
  export function Toaster(): JSX.Element;
  export const toastService: any;
}
