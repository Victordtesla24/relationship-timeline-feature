import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import '@testing-library/jest-dom';

// We no longer need auth mocks

describe('DashboardHeader Component', () => {
  it('renders correctly with basic navigation', () => {
    render(<DashboardHeader title="Dashboard" />);
    
    // Check basic structure
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Relationships')).toBeInTheDocument();
    
    // Make sure navigation links are present
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  it('displays provided title', () => {
    render(<DashboardHeader title="Custom Page Title" />);
    expect(screen.getByText('Custom Page Title')).toBeInTheDocument();
  });
  
  it('navigates to relationships page when Relationships link is clicked', () => {
    render(<DashboardHeader title="Dashboard" />);
    const relationshipsLink = screen.getByText('Relationships');
    
    // Check that the link has the correct href
    expect(relationshipsLink.closest('a')).toHaveAttribute('href', '/relationships');
  });
}); 