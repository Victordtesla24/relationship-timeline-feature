'use client';

import { useState } from 'react';

interface ExportTimelineProps {
  format: 'pdf' | 'docx';
}

export default function ExportTimeline({ format }: ExportTimelineProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/export?format=${format}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }
      
      // In a real implementation, we would handle the file download here
      setSuccess(`Timeline exported as ${format.toUpperCase()} successfully!`);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during export');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Export Timeline</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
      >
        {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
      </button>
    </div>
  );
} 