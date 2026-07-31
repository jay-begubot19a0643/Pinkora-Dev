import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/projects', destination: '/portfolio', permanent: true },
      { source: '/projects/voices-of-innovation', destination: '/portfolio/voices-of-innovation', permanent: true },
    ];
  },
};

export default nextConfig;
