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
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filterByDate"
                name="filterByDate"
                checked={exportSettings.filterByDate}
                onChange={handleSettingChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="filterByDate" className="ml-2 block text-gray-700">
                Filter by date range
              </label>
            </div>
          </div>
          
          {exportSettings.filterByDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <p className="text-gray-700 font-medium mb-2">Include Content</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImages"
                  name="includeImages"
                  checked={exportSettings.includeImages}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeImages" className="ml-2 block text-gray-700">
                  Images
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeDocuments"
                  name="includeDocuments"
                  checked={exportSettings.includeDocuments}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeDocuments" className="ml-2 block text-gray-700">
                  Documents
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-gray-700 font-medium mb-2">Export Format</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleFormatSelect('pdf')}
                className={`px-4 py-2 rounded-md border ${
                  exportSettings.format === 'pdf' 
                    ? 'bg-primary-100 border-primary-500 text-primary-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                PDF Document
              </button>
              
              <button
                onClick={() => handleFormatSelect('docx')}
                className={`px-4 py-2 rounded-md border ${
                  exportSettings.format === 'docx' 
                    ? 'bg-primary-100 border-primary-500 text-primary-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Word Document
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting || !exportSettings.format}
              className={`w-full py-3 rounded-md font-medium text-white ${
                isExporting || !exportSettings.format
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isExporting 
                ? 'Exporting...' 
                : `Export as ${exportSettings.format ? exportSettings.format.toUpperCase() : 'Document'}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 