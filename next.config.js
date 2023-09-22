

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    dirs: ['assets', 'app', 'components', 'util', 'pages'],
  },
};

module.exports = nextConfig;
