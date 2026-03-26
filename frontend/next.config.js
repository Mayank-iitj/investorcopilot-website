/** @type {import('next').NextConfig} */
const backendHttpOrigin = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendHttpOrigin}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${backendHttpOrigin}/ws/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
