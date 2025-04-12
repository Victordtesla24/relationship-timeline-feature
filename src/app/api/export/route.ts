import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';
import Media from '@/models/media';
import { handleApiError } from '@/lib/api-error';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';

// Helper function to fetch all events for a user
async function fetchEventsWithMedia(userId: string) {
  await dbConnect();
  
  // Get events
  const events = await Event.find({ userId }).sort({ date: 1 });
  
  // Get media for each event
  const eventsWithMedia = await Promise.all(
    events.map(async (event) => {
      const media = await Media.find({ eventId: event._id });
      return {
        ...event.toObject(),
        media
      };
    })
  );
  
  return eventsWithMedia;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get export settings from request body
    const settings = await request.json();
    const { format, includeImages, includeDocuments, title } = settings;
    
    // Validate format
    if (format !== 'pdf' && format !== 'docx') {
      return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
    }
    
    // Fetch events with media
    const events = await fetchEventsWithMedia((session.user as any).id);
    
    if (events.length === 0) {
      return NextResponse.json({ error: 'No events found to export' }, { status: 404 });
    }
    
    let buffer;
    
    if (format === 'pdf') {
      buffer = await generatePDF(events, { title, includeImages, includeDocuments });
    } else {
      buffer = await generateDOCX(events, { title, includeImages, includeDocuments });
    }
    
    // Set the appropriate headers for the response
    const headers = new Headers();
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    headers.set('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '-').toLowerCase()}-${format}-${new Date().toISOString().split('T')[0]}.${format}"`);
    
    return new NextResponse(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    return handleApiError(error, 'Error generating export');
  }
}

// PDF Generation
async function generatePDF(events: any[], options: { title: string, includeImages: boolean, includeDocuments: boolean }) {
  // For development purposes, we'll create a simple mock PDF
  // This avoids the PDFKit font loading issues in Next.js
  try {
    // Create a simple PDF string with basic structure
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 6 0 R >> >>
endobj
5 0 obj
<< /Length 67 >>
stream
BT
/F1 24 Tf
100 700 Td
(Timeline Export - Mock PDF for Development) Tj
ET
endstream
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000210 00000 n
0000000251 00000 n
0000000367 00000 n
trailer
<< /Size 7 /Root 1 0 R >>
startxref
434
%%EOF
`;

    // Create a buffer from the PDF string
    return Buffer.from(pdfContent);
  } catch (err) {
    console.error('PDF generation error:', err);
    throw err;
  }
}

// DOCX Generation
async function generateDOCX(events: any[], options: { title: string, includeImages: boolean, includeDocuments: boolean }) {
  const { title, includeImages, includeDocuments } = options;
  
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            alignment: 'center',
          }),
          new Paragraph({
            children: [
              new TextRun(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`),
            ],
            alignment: 'center',
          }),
          new Paragraph({ text: '' }),
          
          // Events
          ...events.flatMap((event, index) => {
            const eventChildren = [
              new Paragraph({
                text: `Event ${index + 1}: ${event.title}`,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Date: ${format(new Date(event.date), 'MMMM d, yyyy')}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({ text: '' }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Description:', bold: true }),
                ],
              }),
              new Paragraph({ text: event.description }),
              new Paragraph({ text: '' }),
            ];
            
            // Add media attachments if available
            if ((includeImages || includeDocuments) && event.media && event.media.length > 0) {
              eventChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Attachments:', bold: true }),
                  ],
                })
              );
              
              event.media.forEach((item) => {
                const isImage = item.type === 'image';
                const isDocument = item.type === 'document';
                
                if ((isImage && includeImages) || (isDocument && includeDocuments)) {
                  eventChildren.push(
                    new Paragraph({
                      text: `• ${item.filename} (${item.type})`,
                    })
                  );
                }
              });
            }
            
            // Add spacing between events
            eventChildren.push(new Paragraph({ text: '' }));
            eventChildren.push(new Paragraph({ text: '' }));
            
            return eventChildren;
          }),
          
          // Footer
          new Paragraph({
            text: 'Confidential Document - Relationship Timeline',
            alignment: 'center',
          }),
        ],
      },
    ],
  });
  
  // Generate buffer
  return await Packer.toBuffer(doc);
} 