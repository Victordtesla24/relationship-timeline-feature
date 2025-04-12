'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

interface ExportSettings {
  includeImages: boolean;
  includeDocuments: boolean;
  format: 'pdf' | 'docx' | null;
  title: string;
}

export default function ExportContent() {
  const { data: session } = useSession();
  // @ts-ignore - using useState directly from React object due to import errors
  const [isExporting, setIsExporting] = React.useState(false);
  // @ts-ignore - using useState directly from React object due to import errors
  const [error, setError] = React.useState<string | null>(null);
  // @ts-ignore - using useState directly from React object due to import errors
  const [success, setSuccess] = React.useState<string | null>(null);
  // @ts-ignore - using useState directly from React object due to import errors
  const [exportSettings, setExportSettings] = React.useState<ExportSettings>({
    includeImages: true,
    includeDocuments: true,
    format: null,
    title: 'Relationship Timeline'
  });
  
  const handleSettingChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setExportSettings((prev: ExportSettings) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleFormatSelect = (format: 'pdf' | 'docx') => {
    setExportSettings((prev: ExportSettings) => ({
      ...prev,
      format
    }));
  };
  
  const handleExport = async () => {
    if (!exportSettings.format) {
      setError('Please select an export format');
      return;
    }
    
    setIsExporting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportSettings)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }
      
      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      
      a.href = url;
      a.download = `${exportSettings.title.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.${exportSettings.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess(`Timeline exported as ${exportSettings.format.toUpperCase()} successfully!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during export');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
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
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Export Options</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={exportSettings.title}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeImages"
                checked={exportSettings.includeImages}
                onChange={handleSettingChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Include Images</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeDocuments"
                checked={exportSettings.includeDocuments}
                onChange={handleSettingChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Include Documents</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Export Format</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleFormatSelect('pdf')}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition ${
              exportSettings.format === 'pdf' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl text-primary-600">PDF</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">PDF Format</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Best for printing and formal documentation</p>
          </button>
          
          <button
            onClick={() => handleFormatSelect('docx')}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition ${
              exportSettings.format === 'docx' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl text-primary-600">DOC</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">DOCX Format</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Best for editing and customizing</p>
          </button>
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          onClick={handleExport}
          disabled={isExporting || !exportSettings.format}
          className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Generating Document...' : `Export as ${exportSettings.format ? exportSettings.format.toUpperCase() : 'Document'}`}
        </button>
      </div>
    </div>
  );
} 