/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, { isServer }) => {
    // Add support for importing PDF files
    config.module.rules.push({
      test: /\.(pdf)$/i,
      type: 'asset/resource',
    });
    
    return config;
  },
}

module.exports = nextConfig 