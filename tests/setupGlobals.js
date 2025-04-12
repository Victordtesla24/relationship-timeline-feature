const { TextEncoder, TextDecoder } = require('util');
const { URL } = require('url');  // Use Node.js built-in URL implementation
require('whatwg-fetch');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = global.Response || Response;
global.Request = global.Request || Request;
global.Headers = global.Headers || Headers;

// Use Node.js URL implementation for consistent behavior
if (!global.URL) {
  global.URL = URL;
}

// Add mock methods needed by tests
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

// Suppress Mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';

// Mock Next.js NextRequest and NextResponse
class NextRequest extends Request {
  constructor(input, init) {
    super(input, init);
    
    // Create a properly structured nextUrl object
    try {
      // Handle both string URLs and Request objects
      const urlString = typeof input === 'string' ? input : input.url;
      // Use native URL parser
      const parsed = new URL(urlString, 'http://localhost:3000');
      this.nextUrl = {
        href: parsed.href,
        origin: parsed.origin,
        protocol: parsed.protocol,
        host: parsed.host,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
      };
    } catch (error) {
      // Fallback for invalid URLs
      this.nextUrl = {
        href: typeof input === 'string' ? input : input.url,
        origin: 'http://localhost:3000',
        protocol: 'http:',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/',
        search: '',
        hash: ''
      };
    }
  }
}

// Mock NextResponse for API tests
global.NextResponse = {
  json: (body, init) => {
    return new Response(JSON.stringify(body), {
      status: init?.status || 200,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers
      }
    });
  },
  redirect: (url) => {
    return new Response(null, {
      status: 302,
      headers: { Location: url }
    });
  }
};

// Add the NextRequest to global scope
global.NextRequest = NextRequest; 