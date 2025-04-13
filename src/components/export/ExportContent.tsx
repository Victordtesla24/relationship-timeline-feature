'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { getEvents, getMediaItems } from '@/utils/localStorage';

interface ExportSettings {
  includeImages: boolean;
  includeDocuments: boolean;
  format: 'pdf' | 'docx' | null;
  title: string;
  startDate: string;
  endDate: string;
  filterByDate: boolean;
}

export default function ExportContent() {
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
    title: 'Relationship Timeline',
    startDate: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'), // Jan 1 of current year
    endDate: format(new Date(), 'yyyy-MM-dd'), // Today
    filterByDate: false
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
      // Get events from localStorage
      let events = getEvents();
      
      // Filter events by date range if needed
      if (exportSettings.filterByDate) {
        const startDate = new Date(exportSettings.startDate).getTime();
        const endDate = new Date(exportSettings.endDate).getTime();
        
        events = events.filter(event => {
          const eventDate = new Date(event.date).getTime();
          return eventDate >= startDate && eventDate <= endDate;
        });
      }
      
      // Sort events by date
      events = events.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      if (events.length === 0) {
        throw new Error('No events found for the selected date range');
      }
      
      // Use dynamic import to load the export libraries only when needed
      if (exportSettings.format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        let y = 20;
        
        // Add title
        doc.setFontSize(24);
        doc.text(exportSettings.title, 20, y);
        y += 10;
        
        // Add date range if filtering
        if (exportSettings.filterByDate) {
          doc.setFontSize(12);
          doc.text(`Period: ${format(new Date(exportSettings.startDate), 'MMM d, yyyy')} to ${format(new Date(exportSettings.endDate), 'MMM d, yyyy')}`, 20, y += 10);
        }
        
        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 20, y += 10);
        y += 10;
        
        // Add events
        for (const event of events) {
          // Add date
          doc.setFontSize(14);
          doc.text(format(parseISO(event.date), 'MMMM d, yyyy'), 20, y += 10);
          
          // Add title
          doc.setFontSize(16);
          doc.text(event.title, 20, y += 10);
          
          // Add description (with line wrapping)
          doc.setFontSize(12);
          const splitDescription = doc.splitTextToSize(event.description, 170);
          doc.text(splitDescription, 20, y += 10);
          y += (splitDescription.length * 7);
          
          // Add images if requested
          if (exportSettings.includeImages && event.mediaIds.length > 0) {
            const mediaItems = getMediaItems(event._id);
            let imageCount = 0;
            
            for (const media of mediaItems) {
              if (media.type === 'image' && imageCount < 2) { // Limit to 2 images per event
                try {
                  // Check if we need a new page
                  if (y > 250) {
                    doc.addPage();
                    y = 20;
                  }
                  
                  // Add image
                  doc.addImage(media.url, 'JPEG', 20, y += 10, 80, 60);
                  y += 70;
                  imageCount++;
                } catch (error) {
                  console.error('Error adding image:', error);
                }
              }
            }
          }
          
          // Add separator
          doc.line(20, y += 10, 190, y);
          y += 10;
          
          // Check if we need a new page
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        }
        
        // Save the document
        const filename = `${exportSettings.title.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        doc.save(filename);
      } else if (exportSettings.format === 'docx') {
        const { Document, Packer, Paragraph, TextRun } = await import('docx');
        const { saveAs } = await import('file-saver');
        
        // Create document
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [new TextRun({ text: exportSettings.title, bold: true, size: 36 } as any)],
                }),
                new Paragraph({
                  children: [new TextRun({ text: ' ' })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, size: 24 } as any)],
                }),
                new Paragraph({
                  children: [new TextRun({ text: ' ' })],
                }),
                ...events.flatMap(event => {
                  const paragraphs = [
                    new Paragraph({
                      children: [new TextRun({ text: format(parseISO(event.date), 'MMMM d, yyyy'), italics: true, size: 24 } as any)],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: event.title, bold: true, size: 28 } as any)],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: event.description, size: 24 } as any)],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: ' ' })],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: '──────────────────────────────────' })],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: ' ' })],
                    }),
                  ];
                  
                  return paragraphs;
                }),
              ],
            },
          ],
        });
        
        // Generate and save document
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const filename = `${exportSettings.title.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.docx`;
        saveAs(blob, filename);
      }
      
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
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="filterByDate"
                checked={exportSettings.filterByDate}
                onChange={handleSettingChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Filter by Date Range</span>
            </label>
            
            {exportSettings.filterByDate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={exportSettings.startDate}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={exportSettings.endDate}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
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