import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { usePathname } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Get mocked functions
const mockSignOut = jest.requireMock('next-auth/react').signOut;
const mockUseSession = jest.requireMock('next-auth/react').useSession;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('DashboardHeader', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    mockSignOut.mockResolvedValue(true);
  });

  it('renders correctly for client users', () => {
    // Mock session with client role
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-id-1',
          name: 'Test Client',
          email: 'client@example.com',
          role: 'client',
        },
      },
      status: 'authenticated',
    });

    render(<DashboardHeader />);

    // Check navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();

    // Check user info display
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('client')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('renders correctly for lawyer users', () => {
    // Mock session with lawyer role
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-id-2',
          name: 'Test Lawyer',
          email: 'lawyer@example.com',
          role: 'lawyer',
        },
      },
      status: 'authenticated',
    });

    render(<DashboardHeader />);

    // Lawyer should see the same navigation options
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();

    // Check user info display with lawyer role
    expect(screen.getByText('Test Lawyer')).toBeInTheDocument();
    expect(screen.getByText('lawyer')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('highlights the active navigation item based on current path', () => {
    (usePathname as jest.Mock).mockReturnValue('/timeline');
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-id-1',
          name: 'Test Client',
          email: 'client@example.com',
          role: 'client',
        },
      },
      status: 'authenticated',
    });

    render(<DashboardHeader />);

    // Dashboard link should not be highlighted
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).not.toHaveClass('bg-primary-100');

    // Timeline link should be highlighted
    const timelineLink = screen.getByText('Timeline').closest('a');
    expect(timelineLink).toHaveClass('bg-primary-100');
  });

  it('calls signOut when Sign out button is clicked', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-id-1',
          name: 'Test Client',
          email: 'client@example.com',
          role: 'client',
        },
      },
      status: 'authenticated',
    });

    render(<DashboardHeader />);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('toggles mobile menu when menu button is clicked', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-id-1',
          name: 'Test Client',
          email: 'client@example.com',
          role: 'client',
        },
      },
      status: 'authenticated',
    });

    render(<DashboardHeader />);

    // Find the mobile menu button by its SVG icon - directly access the button element
    const menuButton = document.querySelector('button svg[viewBox="0 0 24 24"]')?.closest('button');
    expect(menuButton).not.toBe(null);
    
    if (menuButton) {
      // Get initial count of dashboard links
      const initialDashboardLinksCount = document.querySelectorAll('a[href="/dashboard"]').length;
      
      // Click the menu button to open the mobile menu
      fireEvent.click(menuButton);
      
      // After clicking, there should be more dashboard links than initially
      const afterClickDashboardLinksCount = document.querySelectorAll('a[href="/dashboard"]').length;
      expect(afterClickDashboardLinksCount).toBeGreaterThan(initialDashboardLinksCount);
      
      // Click the menu button again to close the mobile menu
      fireEvent.click(menuButton);
      
      // After closing, we should be back to the initial count
      const afterCloseCount = document.querySelectorAll('a[href="/dashboard"]').length;
      expect(afterCloseCount).toEqual(initialDashboardLinksCount);
    }
  });
}); 