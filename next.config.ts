// This file configures Next.js.
// It's used to set up things like custom webpack configurations, image optimization, and environment variables.

import type { NextConfig } from 'next';

// Define the configuration object for Next.js.
const nextConfig: NextConfig = {
  /* config options here */

  // This section configures TypeScript settings for the build process.
  typescript: {
    // This option tells Next.js to ignore TypeScript errors during the build.
    // This is useful for rapid prototyping but should be set to `false` in production
    // to ensure type safety.
    ignoreBuildErrors: true,
  },

  // This section configures ESLint settings for the build process.
  eslint: {
    // This option tells Next.js to ignore ESLint errors during the build.
    // Similar to the TypeScript setting, this is useful for development but should be
    // disabled for production builds to maintain code quality.
    ignoreDuringBuilds: true,
  },

  // This section configures Next.js's built-in Image component optimization.
  images: {
    // `remotePatterns` allows you to specify a list of allowed hostnames for external images.
    // This is a security measure to prevent your application from loading images from malicious sources.
    // Next.js will only optimize images from these approved domains.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // A common placeholder image service.
        port: '',
        pathname: '/**', // Allow any path on this hostname.
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Another popular placeholder image service.
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // A popular source for high-quality stock photos.
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // A service for placeholder user avatars, used in our mock data.
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // `webpack` allows you to customize the underlying webpack configuration used by Next.js.
  webpack: (config, { isServer }) => {
    // This customization is to exclude database drivers that are not used by the project.
    // `knex`, a SQL query builder often included in larger libraries, can bundle multiple drivers
    // (for PostgreSQL, MySQL, etc.), increasing the bundle size.
    // By marking them as `externals`, we tell webpack not to bundle them.
    config.externals.push({
      'mysql': 'mysql',
      'mysql2': 'mysql2',
      'oracledb': 'oracledb',
      'pg-query-stream': 'pg-query-stream',
      'sqlite3': 'sqlite3',
      'tedious': 'tedious', // For SQL Server
      'better-sqlite3': 'commonjs better-sqlite3',
    });

    // It's crucial to return the modified config object.
    return config;
  },
};

// Export the configuration object so Next.js can use it.
export default nextConfig;
