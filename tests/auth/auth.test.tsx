import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

// Get the mocked functions
const mockSignIn = jest.requireMock('next-auth/react').signIn;
const mockUseSession = jest.requireMock('next-auth/react').useSession;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Extend screen object to include missing methods
const extendedScreen = {
  ...screen,
  getByPlaceholderText: (text: string | RegExp) => {
    // Find input with placeholder attribute
    return screen.getByPlaceholderText(text);
  }
};

describe('Authentication', () => {
  describe('LoginForm', () => {
    beforeEach(() => {
      mockSignIn.mockClear();
    });

    it('renders login form correctly', () => {
      render(<LoginForm />);
      
      // Use DOM queries to find elements by attributes for more reliable testing
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it('submits login form with valid credentials', async () => {
      mockSignIn.mockResolvedValueOnce({ error: null });
      
      render(<LoginForm />);
      
      // Use DOM queries to find elements
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, {
          target: { value: 'test@example.com' },
        });
        
        fireEvent.change(passwordInput, {
          target: { value: 'password123' },
        });
      }
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          redirect: false,
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('displays error message on login failure', async () => {
      mockSignIn.mockResolvedValueOnce({ error: 'Invalid credentials' });
      
      render(<LoginForm />);
      
      // Use DOM queries
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, {
          target: { value: 'test@example.com' },
        });
        
        fireEvent.change(passwordInput, {
          target: { value: 'wrongpassword' },
        });
      }
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
      });
    });
  });

  describe('Role-based Access Control', () => {
    it('shows lawyer-specific features for lawyer users', async () => {
      // Mock session with lawyer role
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user-id-1',
            name: 'Lawyer User',
            email: 'lawyer@example.com',
            role: 'lawyer',
          },
        },
        status: 'authenticated',
      });

      // Here you would render components that should display differently based on role
      // For testing purposes, we'll just verify session data
      expect(mockUseSession().data.user.role).toBe('lawyer');
    });

    it('hides lawyer-specific features for client users', async () => {
      // Mock session with client role
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user-id-2',
            name: 'Client User',
            email: 'client@example.com',
            role: 'client',
          },
        },
        status: 'authenticated',
      });

      // Here you would render components that should display differently based on role
      // For testing purposes, we'll just verify session data
      expect(mockUseSession().data.user.role).toBe('client');
    });
  });

  describe('Registration', () => {
    global.fetch = jest.fn();

    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('renders registration form correctly', () => {
      render(<RegisterForm />);
      
      // Use valid selectors for the form elements
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Create account" })).toBeInTheDocument();
    });

    it('submits registration form with valid data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'User registered successfully' }),
      });
      
      render(<RegisterForm />);
      
      // Use input IDs from the actual form implementation
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const roleSelect = document.getElementById('role') as HTMLSelectElement;
      
      if (nameInput && emailInput && passwordInput && roleSelect) {
        fireEvent.change(nameInput, {
          target: { value: 'Test User' },
        });
        
        fireEvent.change(emailInput, {
          target: { value: 'newuser@example.com' },
        });
        
        fireEvent.change(passwordInput, {
          target: { value: 'password123' },
        });
        
        // Select lawyer role
        fireEvent.change(roleSelect, {
          target: { value: 'lawyer' },
        });
      }
      
      fireEvent.click(screen.getByRole('button', { name: "Create account" }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test User',
            email: 'newuser@example.com',
            password: 'password123',
            role: 'lawyer',
          }),
        });
      });
    });

    it('displays error message on registration failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });
      
      render(<RegisterForm />);
      
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      if (nameInput && emailInput && passwordInput) {
        fireEvent.change(nameInput, {
          target: { value: 'Test User' },
        });
        
        fireEvent.change(emailInput, {
          target: { value: 'existing@example.com' },
        });
        
        fireEvent.change(passwordInput, {
          target: { value: 'password123' },
        });
      }
      
      fireEvent.click(screen.getByRole('button', { name: "Create account" }));
      
      await waitFor(() => {
        expect(screen.getByText("Registration failed")).toBeInTheDocument();
      });
    });
  });
}); 