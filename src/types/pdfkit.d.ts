declare module 'pdfkit' {
  interface PDFDocumentOptions {
    margin?: number;
    size?: [number, number] | string;
    layout?: 'portrait' | 'landscape';
    info?: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
    };
    autoFirstPage?: boolean;
    pdfVersion?: string;
    compress?: boolean;
    userPassword?: string;
    ownerPassword?: string;
    permissions?: {
      printing?: string;
      modifying?: boolean;
      copying?: boolean;
      annotating?: boolean;
      fillingForms?: boolean;
      contentAccessibility?: boolean;
      documentAssembly?: boolean;
    };
    bufferPages?: boolean;
  }

  interface TextOptions {
    align?: 'left' | 'center' | 'right' | 'justify';
    width?: number;
    height?: number;
    continued?: boolean;
    indent?: number;
    lineBreak?: boolean;
    baseline?: string;
    underline?: boolean;
    strike?: boolean;
    link?: string;
    oblique?: boolean;
    fill?: boolean;
    stroke?: boolean;
    lineGap?: number;
    characterSpacing?: number;
  }

  class PDFDocument {
    constructor(options?: PDFDocumentOptions);
    
    on(event: 'data', callback: (chunk: Buffer) => void): this;
    on(event: 'end', callback: () => void): this;
    on(event: 'error', callback: (err: Error) => void): this;
    
    fontSize(size: number): this;
    text(text: string, options?: TextOptions): this;
    text(text: string, x?: number, y?: number, options?: TextOptions): this;
    
    moveDown(line?: number): this;
    end(): void;
  }

  export default PDFDocument;
} 