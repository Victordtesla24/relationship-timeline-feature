// Mock implementation of uuid v4 function to prevent ESM import issues
const mockV4 = () => 'test-uuid-' + Math.floor(Math.random() * 1000000);

// CommonJS export to work with Jest
module.exports = { v4: mockV4 };
// Also provide named exports format for ESM compatibility
module.exports.default = { v4: mockV4 };
module.exports.v4 = mockV4; 