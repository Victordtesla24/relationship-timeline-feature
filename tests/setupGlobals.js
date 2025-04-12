const { TextEncoder, TextDecoder } = require('util');
require('whatwg-fetch');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = global.Response || Response;
global.Request = global.Request || Request;
global.Headers = global.Headers || Headers;

// Suppress Mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';

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