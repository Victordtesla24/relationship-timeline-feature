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
        // Import jspdf with a more reliable approach
        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.default;
        
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
          // Check if we need a new page
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          
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
          if (exportSettings.includeImages && event.mediaIds && event.mediaIds.length > 0) {
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
                  
                  // Add image with error handling
                  try {
                    doc.addImage(media.url, 'JPEG', 20, y += 10, 80, 60);
                    y += 70;
                    imageCount++;
                  } catch (imageError) {
                    console.error('Error adding image:', imageError);
                    // Add a placeholder or note instead
                    doc.setFontSize(10);
                    doc.text(`[Image: ${media.name || 'Attachment'}]`, 20, y += 10);
                    y += 15;
                  }
                } catch (error) {
                  console.error('Error processing image:', error);
                }
              }
            }
          }
          
          // Add separator
          doc.line(20, y += 10, 190, y);
          y += 10;
        }
        
        // Save the document
        const filename = `${exportSettings.title.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        doc.save(filename);
      } else if (exportSettings.format === 'docx') {
        // More reliable imports for docx
        const docx = await import('docx');
        const { saveAs } = await import('file-saver');
        
        const { Document, Packer, Paragraph, TextRun } = docx;

        // Create document with better styling but more compatible with types
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: exportSettings.title,
                      bold: true
                    } as any)
                  ]
                }),
                
                exportSettings.filterByDate ? new Paragraph({
                  children: [
                    new TextRun({ 
                      text: `Period: ${format(new Date(exportSettings.startDate), 'MMM d, yyyy')} to ${format(new Date(exportSettings.endDate), 'MMM d, yyyy')}`,
                    } as any)
                  ]
                }) : new Paragraph({}),
                
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: `Generated on: ${format(new Date(), 'MMMM d, yyyy')}`,
                      italics: true
                    } as any)
                  ]
                }),
                
                // Separator
                new Paragraph({
                  children: [new TextRun({ text: "" })]
                }),
                
                ...events.flatMap(event => {
                  return [
                    // Date
                    new Paragraph({
                      children: [
                        new TextRun({ 
                          text: format(parseISO(event.date), 'MMMM d, yyyy'),
                          italics: true,
                          color: '666666'
                        } as any)
                      ]
                    }),
                    
                    // Event title
                    new Paragraph({
                      children: [
                        new TextRun({ 
                          text: event.title,
                          bold: true
                        } as any)
                      ]
                    }),
                    
                    // Description
                    new Paragraph({
                      children: [
                        new TextRun({ 
                          text: event.description
                        })
                      ]
                    }),
                    
                    // Separator
                    new Paragraph({
                      children: [new TextRun({ text: "────────────────────────────────────────" })]
                    }),
                    
                    // Spacing
                    new Paragraph({
                      children: [new TextRun({ text: "" })]
                    }),
                  ];
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
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Export Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg shadow-sm mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Export Successful</h3>
              <p className="mt-2 text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Export Timeline</h2>
          <p className="text-primary-100 text-sm mt-1">Create a document of your relationship timeline</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={exportSettings.title}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                placeholder="My Relationship Timeline"
              />
            </div>
            
            <div className="flex items-start pt-7">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="filterByDate"
                  name="filterByDate"
                  checked={exportSettings.filterByDate}
                  onChange={handleSettingChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="filterByDate" className="font-medium text-gray-700">
                  Filter by date range
                </label>
                <p className="text-gray-500">Only include events within a specific time period</p>
              </div>
            </div>
          </div>
          
          {exportSettings.filterByDate && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range Selection</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={exportSettings.startDate}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={exportSettings.endDate}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Content Options</h3>
            <div className="space-y-3">
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    id="includeImages"
                    name="includeImages"
                    checked={exportSettings.includeImages}
                    onChange={handleSettingChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeImages" className="font-medium text-gray-700">
                    Include Images
                  </label>
                  <p className="text-gray-500">Add photos attached to your events</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    id="includeDocuments"
                    name="includeDocuments"
                    checked={exportSettings.includeDocuments}
                    onChange={handleSettingChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeDocuments" className="font-medium text-gray-700">
                    Include Documents
                  </label>
                  <p className="text-gray-500">Add document references to your export</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Export Format</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => handleFormatSelect('pdf')}
                className={`relative flex flex-col items-center p-5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  exportSettings.format === 'pdf' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-3 rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-900">PDF Document</span>
                  <p className="mt-1 text-xs text-gray-500">Best for printing and sharing</p>
                </div>
                
                {exportSettings.format === 'pdf' && (
                  <div className="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => handleFormatSelect('docx')}
                className={`relative flex flex-col items-center p-5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  exportSettings.format === 'docx' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-3 rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-900">Word Document</span>
                  <p className="mt-1 text-xs text-gray-500">Best for editing and customizing</p>
                </div>
                
                {exportSettings.format === 'docx' && (
                  <div className="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleExport}
            disabled={isExporting || !exportSettings.format}
            className={`w-full py-3 px-4 rounded-md font-medium text-white flex items-center justify-center transition-colors duration-200 ${
              isExporting || !exportSettings.format
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 shadow-sm'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {`Export as ${exportSettings.format ? exportSettings.format.toUpperCase() : 'Document'}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 