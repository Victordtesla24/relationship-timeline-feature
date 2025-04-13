import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportTimeline from '@/components/export/ExportTimeline';

// Mock fetch API
global.fetch = jest.fn();

describe('Timeline Export Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test'], { type: 'application/pdf' })),
    });
  });

  it('renders export options', () => {
    render(<ExportTimeline format="pdf" />);
    
    expect(screen.getByText('Export Timeline')).toBeInTheDocument();
    expect(screen.getByText('Export as PDF')).toBeInTheDocument();
  });

  it('calls export API when PDF export button is clicked', async () => {
    render(<ExportTimeline format="pdf" />);
    
    const exportButton = screen.getByText('Export as PDF');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/export?format=pdf');
    });
  });

  it('calls export API when DOCX export button is clicked', async () => {
    render(<ExportTimeline format="docx" />);
    
    const exportButton = screen.getByText('Export as DOCX');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/export?format=docx');
    });
  });

  it('handles export API errors gracefully', async () => {
    // Mock the console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock fetch to return an error response rather than throwing
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Export failed' }),
    });
    
    render(<ExportTimeline format="pdf" />);
    
    const exportButton = screen.getByText('Export as PDF');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/export?format=pdf');
    });
    
    // Restore the original console.error
    console.error = originalConsoleError;
  });
}); 