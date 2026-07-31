import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/overview', permanent: true },
      { source: '/projects', destination: '/portfolio', permanent: true },
      { source: '/projects/voices-of-innovation', destination: '/portfolio/voices-of-innovation', permanent: true },
      { source: '/services', destination: '/solutions', permanent: true },
      { source: '/clients', destination: '/collaborations', permanent: true },
      { source: '/about', destination: '/who-am-i', permanent: true },
      { source: '/stack', destination: '/tools-and-platforms', permanent: true },
      { source: '/contact', destination: '/get-in-touch', permanent: true },
      { source: '/account', destination: '/my-account', permanent: true },
    ];
  },
};

export default nextConfig;
