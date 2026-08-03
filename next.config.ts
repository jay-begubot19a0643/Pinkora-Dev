import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; connect-src 'self' https://*.supabase.co; font-src 'self' https://fonts.gstatic.com data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https://cdn.simpleicons.org; media-src 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ];
  },
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
