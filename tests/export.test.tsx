import React from 'react';
import { render, screen } from '@testing-library/react';
import ExportContent from '@/components/export/ExportContent';
import { useSession } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react');

// Mock fetch API
global.fetch = jest.fn();

describe('ExportContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: { 
        user: { 
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'client'
        }
      },
      status: 'authenticated'
    });
  });
  
  it('renders the export options correctly', () => {
    render(<ExportContent />);
    
    // Basic rendering tests that check if the component renders without errors
    expect(screen.getByText('Export Options')).toBeInTheDocument();
    expect(screen.getByText('Document Title')).toBeInTheDocument();
    expect(screen.getByText('Include Images')).toBeInTheDocument();
    expect(screen.getByText('Include Documents')).toBeInTheDocument();
    expect(screen.getByText('Export Format')).toBeInTheDocument();
    expect(screen.getByText('PDF Format')).toBeInTheDocument();
    expect(screen.getByText('DOCX Format')).toBeInTheDocument();
  });
}); 