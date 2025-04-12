/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    // Resolve aws4 to our mock implementation
    config.resolve.alias['aws4'] = path.resolve(__dirname, 'src/lib/mock-aws4.js');
    
    return config;
  },
}

module.exports = nextConfig 