import React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    // This is needed for the layout types
    children?: React.ReactNode;
  }
}

// Fix for Next.js layout children types
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> { }
  interface ElementClass extends React.Component<any> {
    render(): React.ReactNode;
  }
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes extends React.Attributes { }
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
} 