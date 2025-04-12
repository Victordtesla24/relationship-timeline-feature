declare module 'docx' {
  export class Document {
    constructor(options: any);
  }

  export enum HeadingLevel {
    TITLE = 'title',
    HEADING_1 = 'heading1',
    HEADING_2 = 'heading2',
    HEADING_3 = 'heading3',
    HEADING_4 = 'heading4',
    HEADING_5 = 'heading5',
    HEADING_6 = 'heading6',
  }

  export class Paragraph {
    constructor(options: {
      text?: string;
      heading?: HeadingLevel;
      alignment?: string;
      children?: TextRun[] | ImageRun[];
    });
  }

  export class TextRun {
    constructor(options: {
      text: string;
      bold?: boolean;
    } | string);
  }

  export class ImageRun {
    constructor(options: {
      data: Buffer;
      transformation: {
        width: number;
        height: number;
      };
    });
  }

  export class Packer {
    static toBuffer(document: Document): Promise<Buffer>;
  }
} 