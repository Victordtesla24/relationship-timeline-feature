'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  href?: string;
  className?: string;
}

// Create a simple button component with no naming
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    asChild = false,
    href,
    className = '',
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-50 focus:ring-gray-500',
      link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 hover:text-primary-700 p-0 focus:ring-0',
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };
    
    // Combine styles based on props
    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${variant !== 'link' ? sizeStyles[size] : ''} ${className}`;
    
    // If href is provided, render as Link
    if (href) {
      return (
        <Link 
          href={href} 
          className={buttonStyles}
          {...(props as any)}
        >
          {children}
        </Link>
      );
    }
    
    // Otherwise render as button
    return (
      <button 
        ref={ref} 
        className={buttonStyles}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Simple export to avoid conflicts
export default Button; 
